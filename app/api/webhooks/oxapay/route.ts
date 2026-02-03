/**
 * OxaPay Webhook Handler
 * Receives payment notifications from OxaPay and updates order status
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { verifyWebhookSignature, OxaPayWebhookPayload } from '@/lib/services/oxapay';

export async function POST(request: NextRequest) {
  try {
    // Get raw body for HMAC verification
    const rawBody = await request.text();
    const hmacHeader = request.headers.get('hmac');

    if (!hmacHeader) {
      console.error('Webhook rejected: Missing HMAC header');
      return NextResponse.json(
        { error: 'Missing HMAC signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const isValid = verifyWebhookSignature(rawBody, hmacHeader);
    if (!isValid) {
      console.error('Webhook rejected: Invalid HMAC signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse webhook payload
    const payload: OxaPayWebhookPayload = JSON.parse(rawBody);

    console.log('OxaPay webhook received:', {
      trackId: payload.track_id,
      orderId: payload.order_id,
      status: payload.status,
      type: payload.type,
    });

    // Only process invoice type webhooks
    if (payload.type !== 'invoice') {
      console.log('Ignoring non-invoice webhook type:', payload.type);
      return NextResponse.json({ message: 'ok' }, { status: 200 });
    }

    // Find order by ID
    const order = await prisma.order.findUnique({
      where: { id: payload.order_id },
      include: {
        items: {
          select: { productId: true },
        },
        transaction: true,
      },
    });

    if (!order) {
      console.error('Order not found:', payload.order_id);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Verify track ID matches
    if (order.paymentTrackId !== payload.track_id) {
      console.error('Track ID mismatch:', {
        expected: order.paymentTrackId,
        received: payload.track_id,
      });
      return NextResponse.json(
        { error: 'Track ID mismatch' },
        { status: 400 }
      );
    }

    // Handle different payment statuses
    switch (payload.status) {
      case 'Paying':
        // Payment detected, awaiting confirmations
        await handlePayingStatus(order.id, payload);
        break;

      case 'Paid':
        // Payment confirmed - complete the order
        await handlePaidStatus(order, payload);
        break;

      case 'Expired':
        // Payment expired - cancel the order
        await handleExpiredStatus(order, payload);
        break;

      case 'Underpaid':
        // Underpaid - store info but keep pending
        await handleUnderpaidStatus(order.id, payload);
        break;

      default:
        console.log('Unknown payment status:', payload.status);
    }

    // Return success response (required by OxaPay)
    return NextResponse.json({ message: 'ok' }, { status: 200 });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Handle "Paying" status - payment detected, awaiting confirmations
 */
async function handlePayingStatus(
  orderId: string,
  payload: OxaPayWebhookPayload
) {
  try {
    // Extract payment address from transactions
    const paymentAddress = payload.txs?.[0]?.address || null;

    // Update transaction with metadata
    await prisma.transaction.update({
      where: { orderId },
      data: {
        status: 'pending',
        metadata: JSON.stringify({
          status: 'paying',
          trackId: payload.track_id,
          txHash: payload.txs?.[0]?.tx_hash,
          confirmations: payload.txs?.[0]?.confirmations || 0,
          currency: payload.currency,
          amount: payload.amount,
          receivedAt: new Date().toISOString(),
        }),
      },
    });

    // Update order with payment address if available
    if (paymentAddress) {
      await prisma.order.update({
        where: { id: orderId },
        data: { paymentAddress },
      });
    }

    console.log('Order payment detected:', orderId);
  } catch (error) {
    console.error('Error handling Paying status:', error);
    throw error;
  }
}

/**
 * Handle "Paid" status - payment confirmed, complete the order
 */
async function handlePaidStatus(
  order: any,
  payload: OxaPayWebhookPayload
) {
  try {
    // Use transaction to ensure atomic updates
    await prisma.$transaction(async (tx) => {
      // Update order status to Completed
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: 'Completed',
          paymentAddress: payload.txs?.[0]?.address || order.paymentAddress,
        },
      });

      // Update transaction status
      await tx.transaction.update({
        where: { orderId: order.id },
        data: {
          status: 'completed',
          reference: payload.track_id,
          metadata: JSON.stringify({
            status: 'paid',
            trackId: payload.track_id,
            txHash: payload.txs?.[0]?.tx_hash,
            confirmations: payload.txs?.[0]?.confirmations || 0,
            currency: payload.currency,
            amount: payload.amount,
            value: payload.value,
            network: payload.txs?.[0]?.network,
            completedAt: new Date().toISOString(),
          }),
        },
      });

      // Mark all products as Sold
      const productIds = order.items.map((item: any) => item.productId);
      await tx.product.updateMany({
        where: { id: { in: productIds } },
        data: { status: 'Sold' },
      });

      // Create notification for user
      await tx.notification.create({
        data: {
          userId: order.userId,
          title: 'Payment Confirmed!',
          message: `Your payment for Order #${order.receiptNumber || order.id.slice(0, 8)} has been confirmed. Your order is now complete.`,
          type: 'success',
        },
      });
    });

    console.log('Order completed:', order.id);
  } catch (error) {
    console.error('Error handling Paid status:', error);
    throw error;
  }
}

/**
 * Handle "Expired" status - payment window expired, cancel order
 */
async function handleExpiredStatus(
  order: any,
  payload: OxaPayWebhookPayload
) {
  try {
    await prisma.$transaction(async (tx) => {
      // Update order status to Cancelled
      await tx.order.update({
        where: { id: order.id },
        data: { status: 'Cancelled' },
      });

      // Update transaction status
      await tx.transaction.update({
        where: { orderId: order.id },
        data: {
          status: 'failed',
          metadata: JSON.stringify({
            status: 'expired',
            trackId: payload.track_id,
            reason: 'Payment window expired',
            expiredAt: new Date().toISOString(),
          }),
        },
      });

      // Return products to Available status
      const productIds = order.items.map((item: any) => item.productId);
      await tx.product.updateMany({
        where: {
          id: { in: productIds },
          status: 'Pending',
        },
        data: { status: 'Available' },
      });

      // Create notification for user
      await tx.notification.create({
        data: {
          userId: order.userId,
          title: 'Payment Expired',
          message: `Payment window for Order #${order.receiptNumber || order.id.slice(0, 8)} has expired. The order has been cancelled.`,
          type: 'warning',
        },
      });
    });

    console.log('Order expired and cancelled:', order.id);
  } catch (error) {
    console.error('Error handling Expired status:', error);
    throw error;
  }
}

/**
 * Handle "Underpaid" status - insufficient payment received
 */
async function handleUnderpaidStatus(
  orderId: string,
  payload: OxaPayWebhookPayload
) {
  try {
    // Update transaction with underpaid info
    await prisma.transaction.update({
      where: { orderId },
      data: {
        metadata: JSON.stringify({
          status: 'underpaid',
          trackId: payload.track_id,
          txHash: payload.txs?.[0]?.tx_hash,
          expectedAmount: payload.amount,
          receivedAmount: payload.txs?.[0]?.received_amount,
          shortfall: payload.amount - (payload.txs?.[0]?.received_amount || 0),
          currency: payload.currency,
          underpaidAt: new Date().toISOString(),
        }),
      },
    });

    console.log('Order underpaid:', orderId);
  } catch (error) {
    console.error('Error handling Underpaid status:', error);
    throw error;
  }
}
