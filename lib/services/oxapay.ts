/**
 * OxaPay Service
 * Handles all interactions with the OxaPay API
 */

import { oxapayConfig } from '@/lib/config/oxapay';
import { createHmac } from 'crypto';

export interface OxaPayInvoiceRequest {
  amount: number;
  currency: string;
  orderId: string;
  email?: string;
  description?: string;
  callbackUrl?: string;
  returnUrl?: string;
  lifetime?: number;
  feePaidByPayer?: number;
  underPaidCoverage?: number;
  sandbox?: boolean;
  name?: string;      // Merchant/business name to display on payment page
  logoUrl?: string;   // Full URL to merchant logo (optional)
}

export interface OxaPayInvoiceResponse {
  data: {
    track_id: string;
    payment_url: string;
    expired_at: number;
    date: number;
  };
  message: string;
  status: number;
}

export interface OxaPayPaymentInfo {
  track_id: string;
  status: string;
  type: string;
  amount: number;
  value: number;
  currency: string;
  order_id: string;
  email?: string;
  description?: string;
  date: number;
  txs?: Array<{
    status: string;
    tx_hash: string;
    sent_amount: number;
    received_amount: number;
    value: number;
    currency: string;
    network: string;
    address: string;
    confirmations: number;
    date: number;
  }>;
}

export interface OxaPayWebhookPayload {
  track_id: string;
  status: string;
  type: string;
  amount: number;
  value: number;
  sent_value: number;
  currency: string;
  order_id: string;
  email?: string;
  note?: string;
  fee_paid_by_payer: boolean;
  under_paid_coverage: number;
  description?: string;
  date: number;
  txs?: Array<{
    status: string;
    tx_hash: string;
    sent_amount: number;
    received_amount: number;
    value: number;
    sent_value: number;
    currency: string;
    network: string;
    sender_address: string;
    address: string;
    rate: number;
    confirmations: number;
    auto_convert_amount?: number;
    auto_convert_currency?: string;
    date: number;
  }>;
}

/**
 * Create a payment invoice with OxaPay
 */
export async function createInvoice(
  params: OxaPayInvoiceRequest
): Promise<OxaPayInvoiceResponse> {
  const url = `${oxapayConfig.apiUrl}/payment/invoice`;

  const body = {
    amount: params.amount,
    currency: params.currency || 'USD',
    order_id: params.orderId,
    email: params.email,
    description: params.description,
    callback_url: params.callbackUrl || oxapayConfig.webhookUrl,
    return_url: params.returnUrl,
    lifetime: params.lifetime || 30, // 30 minutes default
    fee_paid_by_payer: params.feePaidByPayer ?? 1, // Customer pays fee by default
    under_paid_coverage: params.underPaidCoverage ?? 2.5, // 2.5% tolerance
    sandbox: params.sandbox ?? oxapayConfig.sandbox,
    // Merchant branding
    name: params.name,
    logo_url: params.logoUrl,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'merchant_api_key': oxapayConfig.apiKey!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OxaPay API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (data.status !== 200) {
      throw new Error(`OxaPay error: ${data.message || 'Unknown error'}`);
    }

    return data;
  } catch (error) {
    console.error('Error creating OxaPay invoice:', error);
    throw new Error(
      `Failed to create payment invoice: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Get payment information by track ID
 */
export async function getPaymentInfo(
  trackId: string
): Promise<OxaPayPaymentInfo> {
  const url = `${oxapayConfig.apiUrl}/payment/info`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'merchant_api_key': oxapayConfig.apiKey!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ track_id: trackId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OxaPay API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (data.status !== 200) {
      throw new Error(`OxaPay error: ${data.message || 'Unknown error'}`);
    }

    return data.data;
  } catch (error) {
    console.error('Error fetching payment info:', error);
    throw new Error(
      `Failed to fetch payment info: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Verify webhook signature using HMAC SHA-512
 */
export function verifyWebhookSignature(
  payload: string,
  hmacHeader: string
): boolean {
  if (!oxapayConfig.apiKey) {
    console.error('Cannot verify webhook: API key not configured');
    return false;
  }

  try {
    const calculatedHmac = createHmac('sha512', oxapayConfig.apiKey)
      .update(payload)
      .digest('hex');

    return calculatedHmac === hmacHeader;
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
}

/**
 * Extract payment address from OxaPay payment URL
 * The payment URL contains the address in a specific format
 */
export function extractPaymentAddress(paymentUrl: string): string | null {
  try {
    // OxaPay payment URLs are in format: https://pay.oxapay.com/{merchant_id}/{track_id}
    // The actual payment address is retrieved from the payment info API
    return null; // Will be fetched from payment info
  } catch (error) {
    console.error('Error extracting payment address:', error);
    return null;
  }
}
