"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/lib/api/types";
import { removeFromCart, updateCartItem } from "@/lib/actions/cart";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Minus, Clock } from "lucide-react";

interface CartTableProps {
  cartItems: CartItem[];
  onItemsChange: (items: CartItem[]) => void;
}

export function CartTable({ cartItems, onItemsChange }: CartTableProps) {
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
        const updatedItems = cartItems.map((item) =>
          item.id === itemId ? updatedItem : item
        );
        onItemsChange(updatedItems);
        
        // Show success toast
        const item = cartItems.find((i) => i.id === itemId);
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
        const removedItem = cartItems.find((item: CartItem) => item.id === itemId);
        const itemName = removedItem?.product.name || "Item";
        
        // Remove from local state
        const updatedItems = cartItems.filter((item: CartItem) => item.id !== itemId);
        onItemsChange(updatedItems);
        
        // Show success toast
        toast({
          variant: "default",
          title: "Removed from Cart 🗑️",
          description: `${itemName} has been removed from your cart.`,
          duration: 3000,
        });
      } else {
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

  // Get bank initials for badge
  const getBankInitials = (bankName: string) => {
    const words = bankName.split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return bankName.substring(0, 2).toUpperCase();
  };

  // Extract currency from region (e.g., "US United States" -> "USD")
  const getCurrency = (region: string) => {
    if (region.includes("United States") || region.startsWith("US")) {
      return "USD";
    }
    if (region.includes("United Kingdom") || region.startsWith("UK")) {
      return "GBP";
    }
    if (region.includes("Canada") || region.startsWith("CA")) {
      return "CAD";
    }
    return "USD"; // Default
  };

  return (
    <div className="overflow-x-auto rounded-xl shadow bg-card">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-stone-950">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
              Product
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
              Region
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
              Balance
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
              Price
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
              Quantity
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
              Expires In
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {cartItems.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                No items in cart
              </td>
            </tr>
          ) : (
            cartItems.map((item: CartItem) => {
              const isUpdating = updatingItems.has(item.id);
              const isRemovingItem = isRemoving === item.id;
              const currency = getCurrency(item.product.region);

              return (
                <tr key={item.id} className="hover:bg-stone-900/60 transition">
                  {/* Product Column */}
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-3">
                      <Badge
                        variant="secondary"
                        className="rounded-full px-2 py-1 text-xs font-semibold bg-primary/10 text-primary shrink-0"
                      >
                        {getBankInitials(item.product.bank)}
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm mb-1">
                          {item.product.name}
                        </div>
                        <div className="text-xs text-muted-foreground mb-1">
                          {item.product.type}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-2">
                          {item.product.description || "No description available"}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Region Column */}
                  <td className="px-4 py-3">
                    <div className="text-sm">{item.product.region}</div>
                    <div className="text-xs text-muted-foreground">{currency}</div>
                  </td>

                  {/* Balance Column */}
                  <td className="px-4 py-3">
                    <div className="text-sm text-green-400 font-semibold">
                      {currency} {item.product.balance.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </td>

                  {/* Price Column */}
                  <td className="px-4 py-3">
                    <div className="text-sm font-semibold">
                      ${item.product.price.toFixed(2)}
                    </div>
                  </td>

                  {/* Quantity Column */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleDecrease(item)}
                        disabled={isUpdating || isRemovingItem || item.quantity <= 1}
                        variant="ghost"
                        size="icon-sm"
                        className="h-7 w-7 rounded-md"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="min-w-[1.5rem] text-center font-semibold text-sm">
                        {item.quantity}
                      </span>
                      <Button
                        onClick={() => handleIncrease(item)}
                        disabled={isUpdating || isRemovingItem}
                        variant="ghost"
                        size="icon-sm"
                        className="h-7 w-7 rounded-md"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>

                  {/* Expires In Column */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>24:00</span>
                    </div>
                  </td>

                  {/* Action Column */}
                  <td className="px-4 py-3">
                    <Button
                      onClick={() => handleRemove(item.id)}
                      disabled={isRemovingItem || isUpdating}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                    >
                      <Trash2 className="w-4 h-4" />
                      {isRemovingItem ? "Removing..." : "Remove"}
                    </Button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

