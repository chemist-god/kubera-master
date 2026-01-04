"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, AlertCircle } from "lucide-react";
import { CartTable } from "./cart-table";
import { CartItem } from "@/lib/api/types";
import { createOrder } from "@/lib/actions/orders";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface CartPageClientProps {
    initialCartItems: CartItem[];
    availableFunds: number;
    total: number;
    hasInsufficientBalance: boolean;
}

export function CartPageClient({
    initialCartItems,
    availableFunds,
    total: initialTotal,
    hasInsufficientBalance: initialHasInsufficientBalance,
}: CartPageClientProps) {
    const [cartItems, setCartItems] = useState(initialCartItems);
    const [isProcessing, setIsProcessing] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    // Recalculate total when cart items change
    const total = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );
    const hasInsufficientBalance = availableFunds < total;

    const handleProceedToCheckout = async () => {
        if (hasInsufficientBalance) {
            toast({
                variant: "destructive",
                title: "Insufficient Balance",
                description: "Please top up your account to proceed with checkout.",
                duration: 4000,
            });
            return;
        }

        setIsProcessing(true);
        try {
            const cartItemIds = cartItems.map((item) => item.id);
            const result = await createOrder(cartItemIds);

            if (result.success) {
                toast({
                    variant: "success",
                    title: "Order Created! 🎉",
                    description: "Your order has been successfully created.",
                    duration: 3000,
                });

                // Redirect to orders page
                setTimeout(() => {
                    router.push("/user/orders");
                    router.refresh();
                }, 1000);
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: result.error || "Failed to create order.",
                    duration: 4000,
                });
            }
        } catch (error) {
            console.error("Error creating order:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "An unexpected error occurred while creating the order.",
                duration: 4000,
            });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Cart Table */}
            <CartTable cartItems={cartItems} onItemsChange={setCartItems} />

            {/* Summary and Checkout Section */}
            <div className="flex justify-end">
                <div className="w-full max-w-md space-y-4">
                    {/* Total Amount */}
                    <div className="flex flex-col items-end gap-2">
                        <span className="text-sm text-muted-foreground">Total Amount:</span>
                        <span className="text-3xl font-bold">
                            ${total.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </span>
                    </div>

                    {/* Proceed to Checkout Button */}
                    <Button
                        onClick={handleProceedToCheckout}
                        disabled={isProcessing || hasInsufficientBalance || cartItems.length === 0}
                        className="w-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2 py-6 text-lg font-semibold"
                        size="lg"
                    >
                        <FileText className="w-5 h-5" />
                        {isProcessing ? "Processing..." : "Proceed to Checkout"}
                    </Button>

                    {/* Insufficient Balance Error */}
                    {hasInsufficientBalance && (
                        <div className="flex items-center gap-2 text-destructive text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>Insufficient balance. Please top up your account.</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

