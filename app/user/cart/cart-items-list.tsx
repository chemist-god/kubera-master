"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/lib/api/types";
import { removeFromCart } from "@/lib/actions/cart";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

export function CartItemsList({ cartItems }: { cartItems: CartItem[] }) {
  const [items, setItems] = useState(cartItems);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const { toast } = useToast();

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

  const total = items.reduce((sum: number, item: CartItem) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  return (
    <div className="w-full space-y-4">
      {items.map((item: CartItem) => (
        <Card key={item.id} className="p-4">
          <CardContent className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold">{item.product.name}</h3>
              <p className="text-sm text-muted-foreground">
                ${item.product.price} × {item.quantity}
              </p>
              <p className="text-primary font-bold">
                ${(item.product.price * item.quantity).toLocaleString()}
              </p>
            </div>
            <Button
              onClick={() => handleRemove(item.id)}
              disabled={isRemoving === item.id}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              {isRemoving === item.id ? "Removing..." : "Remove"}
            </Button>
          </CardContent>
        </Card>
      ))}
      <Card className="p-6">
        <CardContent className="flex justify-between items-center">
          <span className="text-xl font-bold">Total:</span>
          <span className="text-2xl font-bold text-primary">
            ${total.toLocaleString()}
          </span>
        </CardContent>
      </Card>
    </div>
  );
}

