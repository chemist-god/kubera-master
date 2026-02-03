"use client";

/**
 * Payment Display - Client Component
 * Shows payment details with real-time status updates
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, CheckCircle2, Clock, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';
import { Order } from '@/lib/api/types';

interface PaymentDisplayProps {
  order: Order;
}

export function PaymentDisplay({ order }: PaymentDisplayProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [isExpired, setIsExpired] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string>(order.status);
  const [isPolling, setIsPolling] = useState(true);

  // Calculate time remaining
  useEffect(() => {
    if (!order.paymentExpiresAt) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const expiry = new Date(order.paymentExpiresAt!).getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeRemaining('Expired');
        setIsExpired(true);
        setIsPolling(false);
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [order.paymentExpiresAt]);

  // Poll payment status
  const checkPaymentStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/orders/${order.id}/payment-status`);
      if (!response.ok) return;

      const data = await response.json();
      
      if (data.status !== paymentStatus) {
        setPaymentStatus(data.status);

        if (data.status === 'Completed') {
          setIsPolling(false);
          toast.success('Payment Confirmed!', {
            description: 'Redirecting to your order...',
          });
          setTimeout(() => {
            router.push(`/user/orders/${order.id}?new=true`);
          }, 2000);
        } else if (data.status === 'Cancelled') {
          setIsPolling(false);
          setIsExpired(true);
        }
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    }
  }, [order.id, paymentStatus, router]);

  useEffect(() => {
    if (!isPolling) return;

    // Poll every 10 seconds
    const interval = setInterval(checkPaymentStatus, 10000);
    
    // Check immediately on mount
    checkPaymentStatus();

    return () => clearInterval(interval);
  }, [isPolling, checkPaymentStatus]);

  const copyAddress = async () => {
    if (!order.paymentAddress) {
      toast.error('Payment address not available yet');
      return;
    }

    try {
      await navigator.clipboard.writeText(order.paymentAddress);
      setCopied(true);
      toast.success('Address copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy address');
    }
  };

  const openPaymentUrl = () => {
    // Use the stored payment URL from OxaPay
    if (order.paymentUrl) {
      window.open(order.paymentUrl, '_blank');
    } else {
      toast.error('Payment URL not available');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Complete Your Payment
        </h1>
        <p className="text-muted-foreground text-lg">
          Order #{order.receiptNumber || order.id.slice(0, 8)}
        </p>
      </div>

      {/* Payment Status Card */}
      <Card className="border-border/50 shadow-xl">
        <CardHeader className="bg-primary/5 border-b border-border/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Payment Status</CardTitle>
            <Badge
              variant={
                paymentStatus === 'Completed'
                  ? 'default'
                  : paymentStatus === 'Cancelled'
                  ? 'destructive'
                  : 'secondary'
              }
              className="text-sm"
            >
              {paymentStatus === 'Pending' && !isExpired && (
                <>
                  <Clock className="w-4 h-4 mr-1" />
                  Awaiting Payment
                </>
              )}
              {paymentStatus === 'Completed' && (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Confirmed
                </>
              )}
              {(paymentStatus === 'Cancelled' || isExpired) && (
                <>
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Expired
                </>
              )}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-6">
          {!isExpired && paymentStatus === 'Pending' && (
            <>
              {/* Timer */}
              <div className="text-center p-6 bg-muted/30 rounded-xl">
                <div className="text-sm text-muted-foreground mb-2">
                  Payment expires in
                </div>
                <div className="text-4xl font-bold text-primary font-mono">
                  {timeRemaining}
                </div>
              </div>

              {/* Amount */}
              <div className="text-center space-y-2">
                <div className="text-sm text-muted-foreground">Amount to Pay</div>
                <div className="text-3xl font-bold">
                  ${order.total.toFixed(2)} USD
                </div>
              </div>

              {/* Payment Button */}
              <div className="flex justify-center">
                <Button
                  onClick={openPaymentUrl}
                  size="lg"
                  className="w-full max-w-md h-14 text-lg"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Open Payment Page
                </Button>
              </div>

              {/* Payment Address (if available) */}
              {order.paymentAddress && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-4">
                      Or send payment directly to:
                    </div>
                    
                    {/* QR Code */}
                    <div className="flex justify-center mb-4">
                      <div className="p-4 bg-white rounded-xl">
                        <QRCode
                          value={order.paymentAddress}
                          size={200}
                          level="M"
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex items-center justify-center gap-2 p-4 bg-muted/30 rounded-xl">
                      <code className="text-sm font-mono break-all">
                        {order.paymentAddress}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={copyAddress}
                        className="shrink-0"
                      >
                        {copied ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Instructions */}
              <div className="space-y-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold text-blue-500">Important:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Send the exact amount shown above</li>
                      <li>Payment will be confirmed automatically</li>
                      <li>Do not close this page until payment is confirmed</li>
                      <li>You will be redirected once payment is verified</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Monitoring Status */}
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Monitoring blockchain for payment...</span>
              </div>
            </>
          )}

          {paymentStatus === 'Completed' && (
            <div className="text-center space-y-4 py-8">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-green-500 mb-2">
                  Payment Confirmed!
                </h3>
                <p className="text-muted-foreground">
                  Redirecting to your order...
                </p>
              </div>
            </div>
          )}

          {isExpired && paymentStatus !== 'Completed' && (
            <div className="text-center space-y-4 py-8">
              <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-10 h-10 text-yellow-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-yellow-500 mb-2">
                  Payment Expired
                </h3>
                <p className="text-muted-foreground mb-4">
                  The payment window has expired. Please try again.
                </p>
                <Button
                  onClick={() => router.push('/user/cart')}
                  variant="outline"
                >
                  Return to Cart
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${order.subtotal?.toFixed(2) || order.total.toFixed(2)}</span>
          </div>
          {order.taxAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Tax ({(order.taxRate * 100).toFixed(1)}%)
              </span>
              <span>${order.taxAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="h-px bg-border" />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span className="text-primary">${order.total.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
