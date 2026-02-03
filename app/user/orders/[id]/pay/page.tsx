/**
 * Payment Page - Server Component
 * Displays payment details and handles real-time status updates
 */

import { redirect } from 'next/navigation';
import { getOrder } from '@/lib/actions/orders';
import { PaymentDisplay } from './payment-display';
import Link from 'next/link';

interface PaymentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PaymentPage({ params }: PaymentPageProps) {
  const { id } = await params;
  const result = await getOrder(id);

  if (!result.success || !result.data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-2">Order Not Found</h1>
        <p className="text-muted-foreground mb-4">
          Could not retrieve order details. ID: {id}
        </p>
        <Link href="/user/orders" className="text-primary hover:underline">
          Return to Orders
        </Link>
      </div>
    );
  }

  const order = result.data;

  // If order is already completed, redirect to receipt
  if (order.status === 'Completed') {
    redirect(`/user/orders/${id}?new=true`);
  }

  // If order is cancelled, show cancellation message
  if (order.status === 'Cancelled') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold text-yellow-500 mb-2">Order Cancelled</h1>
        <p className="text-muted-foreground mb-4">
          This order has been cancelled. The payment window may have expired.
        </p>
        <Link href="/user/orders" className="text-primary hover:underline">
          Return to Orders
        </Link>
      </div>
    );
  }

  // If no payment track ID, something went wrong
  if (!order.paymentTrackId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-2">Payment Not Initialized</h1>
        <p className="text-muted-foreground mb-4">
          Payment has not been set up for this order.
        </p>
        <Link href="/user/cart" className="text-primary hover:underline">
          Return to Cart
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground py-10 px-4 md:px-8">
      <PaymentDisplay order={order} />
    </main>
  );
}
