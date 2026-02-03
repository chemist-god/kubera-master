/**
 * Payment Status Polling API
 * Returns current payment status for an order
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAuth } from '@/lib/auth/require-auth';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate user
    const userId = await requireAuth();
    const { id: orderId } = await context.params;

    // Get order with payment details
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        transaction: {
          select: {
            status: true,
            metadata: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Verify order belongs to user
    if (order.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Parse transaction metadata if available
    let transactionMetadata = null;
    if (order.transaction?.metadata) {
      try {
        transactionMetadata = JSON.parse(order.transaction.metadata);
      } catch (e) {
        console.error('Error parsing transaction metadata:', e);
      }
    }

    // Calculate if payment is expired
    const isExpired = order.paymentExpiresAt
      ? new Date(order.paymentExpiresAt) < new Date()
      : false;

    // Return payment status
    return NextResponse.json({
      orderId: order.id,
      status: order.status,
      paymentProvider: order.paymentProvider,
      paymentTrackId: order.paymentTrackId,
      paymentUrl: order.paymentUrl,
      paymentAddress: order.paymentAddress,
      paymentExpiresAt: order.paymentExpiresAt,
      isExpired,
      transaction: {
        status: order.transaction?.status,
        metadata: transactionMetadata,
      },
    });
  } catch (error) {
    console.error('Error fetching payment status:', error);
    
    // Check if it's an auth error
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
