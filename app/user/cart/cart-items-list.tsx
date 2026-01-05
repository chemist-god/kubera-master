"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CartItem } from "@/lib/api/types";
import { removeFromCart, updateCartItem } from "@/lib/actions/cart";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Minus } from "lucide-react";
import Image from "next/image";
import { getBankLogo } from "@/lib/utils/bank-logos";

export function CartItemsList({ cartItems }: { cartItems: CartItem[] }) {
  const [items, setItems] = useState(cartItems);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  /**
   * Update quantity of a cart item
   */
  async function handleUpdateQuantity(itemId: string, newQuantity: number) {
    setUpdatingItems((prev) => new Set(prev).add(itemId));
    try {
      const result = await updateCartItem(itemId, newQuantity);
      if (result.success && result.data) {
        const updatedItem = result.data as CartItem;

        // Update local state
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === itemId ? updatedItem : item
          )
        );

        // Show success toast
        const item = items.find((i) => i.id === itemId);
        const itemName = item?.product.name || "Item";

        if (newQuantity > item!.quantity) {
          toast({
            variant: "default",
            title: "Quantity Increased ✨",
            description: `${itemName} quantity updated to ${newQuantity}.`,
            duration: 2000,
          });
        } else {
          toast({
            variant: "default",
            title: "Quantity Decreased",
            description: `${itemName} quantity updated to ${newQuantity}.`,
            duration: 2000,
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to update quantity.",
          duration: 4000,
        });
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
        duration: 4000,
      });
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  }

  /**
   * Increase quantity by 1
   */
  function handleIncrease(item: CartItem) {
    handleUpdateQuantity(item.id, item.quantity + 1);
  }

  /**
   * Decrease quantity by 1
   */
  function handleDecrease(item: CartItem) {
    if (item.quantity > 1) {
      handleUpdateQuantity(item.id, item.quantity - 1);
    }
  }

  /**
   * Remove item completely from cart
   */
  async function handleRemove(itemId: string) {
    setIsRemoving(itemId);
    try {
      const result = await removeFromCart(itemId);
      if (result.success) {
        // Find the item being removed to show its name in toast
        const removedItem = items.find((item: CartItem) => item.id === itemId);
        const itemName = removedItem?.product.name || "Item";

        // Remove from local state
        setItems(items.filter((item: CartItem) => item.id !== itemId));

        // Show success toast
        toast({
          variant: "default",
          title: "Removed from Cart 🗑️",
          description: `${itemName} has been removed from your cart.`,
          duration: 3000,
        });
      } else {
        // Show error toast
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to remove item from cart.",
          duration: 4000,
        });
      }
    } catch (error) {
      console.error("Error removing item:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while removing the item.",
        duration: 4000,
      });
    } finally {
      setIsRemoving(null);
    }
  }

  // Get bank initials for badge fallback
  const getBankInitials = (bankName: string) => {
    const words = bankName.split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return bankName.substring(0, 2).toUpperCase();
  };

  const total = items.reduce((sum: number, item: CartItem) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  return (
    <div className="w-full space-y-4">
      {items.map((item: CartItem) => {
        const isUpdating = updatingItems.has(item.id);
        const isRemovingItem = isRemoving === item.id;

        return (
          <Card key={item.id} className="p-4">
            <CardContent className="flex flex-col gap-4">
              {/* Product Info */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  {(() => {
                    const logoPath = getBankLogo(item.product.bank);
                    return logoPath ? (
                      <div className="w-12 h-12 flex-shrink-0 rounded-full overflow-hidden bg-white border border-border/50 flex items-center justify-center relative">
                        <Image
                          src={logoPath}
                          alt={`${item.product.bank} logo`}
                          width={48}
                          height={48}
                          className="absolute inset-0 w-full h-full object-contain scale-125"
                        />
                      </div>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="rounded-full px-2 py-1 text-xs font-semibold bg-primary/10 text-primary shrink-0"
                      >
                        {getBankInitials(item.product.bank)}
                      </Badge>
                    );
                  })()}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      ${item.product.price.toFixed(2)} per item
                    </p>
                    <p className="text-primary font-bold text-xl">
                      ${(item.product.price * item.quantity).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quantity Controls and Remove Button */}
              <div className="flex items-center justify-between gap-4">
                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Quantity:</span>
                  <div className="flex items-center gap-2 border rounded-lg p-1">
                    <Button
                      onClick={() => handleDecrease(item)}
                      disabled={isUpdating || isRemovingItem || item.quantity <= 1}
                      variant="ghost"
                      size="icon-sm"
                      className="h-8 w-8 rounded-md"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="min-w-[2rem] text-center font-semibold">
                      {item.quantity}
                    </span>
                    <Button
                      onClick={() => handleIncrease(item)}
                      disabled={isUpdating || isRemovingItem}
                      variant="ghost"
                      size="icon-sm"
                      className="h-8 w-8 rounded-md"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Remove Button */}
                <Button
                  onClick={() => handleRemove(item.id)}
                  disabled={isRemovingItem || isUpdating}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                  {isRemovingItem ? "Removing..." : "Remove"}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
      <Card className="p-6">
        <CardContent className="flex justify-between items-center">
          <span className="text-xl font-bold">Total:</span>
          <span className="text-2xl font-bold text-primary">
            ${total.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </CardContent>
      </Card>
    </div>
  );
}

