"use client";

import { useEffect, useState } from "react";
import { Order, OrderItem } from "@/lib/api/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Printer, ArrowLeft, Copy, ShoppingBag, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";
import { businessConfig } from "@/lib/config/business";
import { policies } from "@/lib/config/policies";
import { formatCurrency, formatReceiptDate } from "@/lib/utils/receipt-helpers";
import QRCode from "react-qr-code";
import "./print-styles.css";

interface OrderReceiptProps {
    order: Order;
    isNew?: boolean;
}

export function OrderReceipt({ order, isNew = false }: OrderReceiptProps) {
    const [hasCopied, setHasCopied] = useState(false);

    useEffect(() => {
        if (isNew) {
            // Trigger confetti animation for new orders
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            const randomInRange = (min: number, max: number) => {
                return Math.random() * (max - min) + min;
            };

            const interval: NodeJS.Timeout = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
                });
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
                });
            }, 250);

            return () => clearInterval(interval);
        }
    }, [isNew]);

    const handlePrint = () => {
        window.print();
    };

    const copyOrderId = () => {
        navigator.clipboard.writeText(order.id);
        setHasCopied(true);
        toast.success("Order ID copied to clipboard");
        setTimeout(() => setHasCopied(false), 2000);
    };

    return (
        <div id="receipt-content" className="w-full max-w-3xl mx-auto animate-in fade-in zoom-in duration-500">
            {/* Success Header for New Orders */}
            {isNew && (
                <div className="text-center mb-8 space-y-4">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto ring-8 ring-green-500/5">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                        Payment Successful!
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Thank you for your purchase. Your order has been secured.
                    </p>
                </div>
            )}

            {/* Receipt Card */}
            <Card className="receipt-card border-border/50 shadow-2xl overflow-hidden bg-card/80 backdrop-blur-xl print:shadow-none print:border-none">

                {/* Receipt Header (Visible especially on Print) */}
                <div className="receipt-header bg-primary/5 p-6 border-b border-border/50">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <Link href="/" className="flex items-center gap-2 mb-2">
                                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                                    <ShoppingBag className="h-5 w-5 text-primary-foreground" />
                                </div>
                                <span className="font-bold text-xl tracking-tight">{businessConfig.name}</span>
                            </Link>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">Official Receipt</div>
                            <div className="text-xs text-muted-foreground space-y-1">
                                <div className="flex items-center gap-1">
                                    <Mail className="w-3 h-3" />
                                    <span>{businessConfig.email}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Phone className="w-3 h-3" />
                                    <span>{businessConfig.phone}</span>
                                </div>
                                <div>{businessConfig.website}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-muted-foreground mb-1">Order Date</div>
                            <div className="font-medium text-sm">
                                {formatReceiptDate(new Date(order.createdAt))}
                            </div>
                        </div>
                    </div>
                </div>

                <CardContent className="p-8 space-y-8">
                    {/* Order Info Bar */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-muted/30 border border-border/40">
                        <div className="space-y-1">
                            <span className="text-xs text-muted-foreground uppercase">Order ID</span>
                            <div className="flex items-center gap-2">
                                <span className="font-mono font-medium text-foreground text-sm">#{order.id.slice(0, 8)}</span>
                                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-50 hover:opacity-100 print:hidden" onClick={copyOrderId}>
                                    {hasCopied ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs text-muted-foreground uppercase">Receipt Number</span>
                            <div className="font-mono font-medium text-sm">
                                {order.receiptNumber || `ORD-${order.id.slice(0, 8)}`}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs text-muted-foreground uppercase">Status</span>
                            <div>
                                <Badge
                                    variant={order.status === 'Completed' ? 'default' : 'secondary'}
                                    className={cn(
                                        "capitalize px-3 py-1 text-xs",
                                        order.status === 'Pending' && "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
                                        order.status === 'Completed' && "bg-green-500/10 text-green-600 border-green-500/20",
                                        order.status === 'Cancelled' && "bg-red-500/10 text-red-600 border-red-500/20",
                                    )}
                                >
                                    {order.status}
                                </Badge>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs text-muted-foreground uppercase">Payment Method</span>
                            <div className="font-medium text-sm">
                                {order.paymentMethod}
                            </div>
                        </div>
                    </div>

                    {/* Customer Information */}
                    {order.user && (
                        <div className="customer-info border rounded-lg p-4 bg-muted/10">
                            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Bill To
                            </h3>
                            <div className="space-y-1 text-sm">
                                <p className="font-medium">{order.user.username}</p>
                                <p className="text-muted-foreground flex items-center gap-2">
                                    <Mail className="w-3 h-3" />
                                    {order.user.email}
                                </p>
                                {order.user.phone && (
                                    <p className="text-muted-foreground flex items-center gap-2">
                                        <Phone className="w-3 h-3" />
                                        {order.user.phone}
                                    </p>
                                )}
                                {order.user.address && (
                                    <div className="text-muted-foreground mt-2">
                                        <p>{order.user.address}</p>
                                        <p>
                                            {order.user.city && `${order.user.city}, `}
                                            {order.user.state && `${order.user.state} `}
                                            {order.user.zipCode}
                                        </p>
                                        <p>{order.user.country}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Transaction Details */}
                    {order.transaction && (
                        <div className="border rounded-lg p-4 bg-muted/10">
                            <h3 className="font-semibold text-sm mb-3">Transaction Details</h3>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span className="text-xs text-muted-foreground uppercase block">Transaction ID</span>
                                    <span className="font-mono text-xs">{order.transactionId}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-muted-foreground uppercase block">Payment Status</span>
                                    <span className="capitalize">{order.transaction.status}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-muted-foreground uppercase block">Payment Method</span>
                                    <span className="capitalize">{order.transaction.method}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-muted-foreground uppercase block">Transaction Type</span>
                                    <span className="capitalize">{order.transaction.type}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <Separator className="bg-border/50" />

                    {/* Line Items */}
                    <div className="order-items space-y-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            Purchase Details
                        </h3>

                        <div className="space-y-2">
                            {/* Header */}
                            <div className="grid grid-cols-12 text-xs uppercase tracking-wider text-muted-foreground px-2 pb-2 border-b border-border/30">
                                <div className="col-span-6 md:col-span-5">Item</div>
                                <div className="hidden md:block md:col-span-2 text-center">Type</div>
                                <div className="col-span-2 text-center">Qty</div>
                                <div className="col-span-2 text-right">Price</div>
                                <div className="col-span-2 text-right">Total</div>
                            </div>

                            {/* Items */}
                            {order.items.map((item: OrderItem) => (
                                <div key={item.id} className="grid grid-cols-12 items-center py-3 px-2 border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors rounded-lg print:hover:bg-transparent">
                                    <div className="col-span-6 md:col-span-5">
                                        <span className="font-medium text-foreground block">{item.product.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                            SKU: {item.product.id.slice(0, 8).toUpperCase()}
                                        </span>
                                        <span className="text-xs text-muted-foreground md:hidden block">
                                            {formatCurrency(item.price)} each
                                        </span>
                                    </div>

                                    <div className="hidden md:block md:col-span-2 text-center">
                                        <Badge variant="outline" className="text-[10px] font-normal opacity-80">{item.product.type}</Badge>
                                    </div>
                                    
                                    <div className="col-span-2 text-center text-sm">
                                        x{item.quantity}
                                    </div>

                                    <div className="col-span-2 text-right text-sm text-muted-foreground hidden md:block">
                                        {formatCurrency(item.price)}
                                    </div>
                                    
                                    <div className="col-span-2 text-right font-medium text-foreground">
                                        {formatCurrency(item.price * item.quantity)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator className="bg-border/50" />

                    {/* Totals */}
                    <div className="order-summary flex justify-end">
                        <div className="w-full md:w-1/2 space-y-3">
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Subtotal</span>
                                <span>{formatCurrency(order.subtotal || order.total)}</span>
                            </div>
                            {order.taxRate > 0 && (
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Tax ({(order.taxRate * 100).toFixed(1)}%)</span>
                                    <span>{formatCurrency(order.taxAmount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Processing Fee</span>
                                <span>$0.00</span>
                            </div>
                            <Separator className="bg-border/50" />
                            <div className="flex justify-between items-end pt-2">
                                <span className="font-bold text-lg">Total Paid</span>
                                <span className="text-3xl font-bold text-primary tracking-tight">
                                    {formatCurrency(order.total)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* QR Code & Footer Information */}
                    <div className="receipt-footer border-t pt-6 mt-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* QR Code */}
                            <div className="qr-code-section flex flex-col items-center justify-center">
                                <QRCode
                                    value={`${businessConfig.website}/user/orders/${order.id}`}
                                    size={128}
                                    level="M"
                                    className="mb-2"
                                />
                                <p className="text-xs text-muted-foreground text-center">
                                    Scan to view order online
                                </p>
                            </div>

                            {/* Policies */}
                            <div className="space-y-3 text-xs">
                                <div>
                                    <h4 className="font-semibold mb-1">Return Policy</h4>
                                    <p className="text-muted-foreground">{policies.returnPolicy}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1">Customer Service</h4>
                                    <p className="text-muted-foreground">
                                        {policies.customerService.email} | {policies.customerService.phone}
                                    </p>
                                    <p className="text-muted-foreground">{policies.customerService.hours}</p>
                                </div>
                            </div>
                        </div>

                        {/* Thank You Message */}
                        <div className="text-center mt-6 pt-6 border-t">
                            <p className="text-sm font-medium italic">{policies.thankYou}</p>
                            <p className="text-xs text-muted-foreground mt-2">{policies.legal}</p>
                        </div>

                        {/* Print Date */}
                        <div className="text-center mt-4 text-xs text-muted-foreground">
                            <p>Receipt generated on: {formatReceiptDate(new Date())}</p>
                            <p className="mt-1">{policies.additionalNotes}</p>
                        </div>
                    </div>
                </CardContent>

                {/* Footer Actions */}
                <CardFooter className="bg-muted/30 p-6 flex flex-col md:flex-row gap-4 justify-between items-center print:hidden">
                    <Button variant="outline" onClick={() => window.location.href = '/shop'} className="w-full md:w-auto">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Return to Shop
                    </Button>
                    <div className="flex gap-3 w-full md:w-auto">
                        <Button variant="secondary" onClick={handlePrint} className="flex-1 md:flex-none">
                            <Printer className="w-4 h-4 mr-2" />
                            Print Receipt
                        </Button>
                        {!isNew && (
                            <Button variant="default" asChild className="flex-1 md:flex-none">
                                <Link href="/user/orders">
                                    View All Orders
                                </Link>
                            </Button>
                        )}
                    </div>
                </CardFooter>
            </Card>

            <div className="text-center mt-8 print:hidden">
                <p className="text-sm text-muted-foreground">
                    Need help with this order? <a href="/user/tickets" className="text-primary hover:underline underline-offset-4">Contact Support</a>
                </p>
            </div>
        </div>
    );
}
