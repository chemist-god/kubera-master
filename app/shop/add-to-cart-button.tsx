"use client";

import { ActionButton } from "@/components/common/action-button";
import { ShoppingCart } from "lucide-react";
import { addToCart } from "@/lib/actions/cart";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { setCartItemTimer } from "@/lib/utils/cart-timers";

interface CartItemData {
  id: string;
  quantity: number;
  product: {
    name: string;
  };
}

export function AddToCartButton({ productId }: { productId: string }) {
  const { toast } = useToast();
  const router = useRouter();

  const handleAddToCart = async () => {
    const result = await addToCart(productId, 1);
    
    if (result.success && result.data) {
      const cartItem = result.data as CartItemData;
      const productName = cartItem.product?.name || "Item";
      
      // Check if item was updated (already in cart) or newly added
      // If quantity > 1, it means it was already in cart and quantity was incremented
      const isUpdate = cartItem.quantity > 1;
      
      if (isUpdate) {
        // Item already in cart, quantity updated - don't redirect
        toast({
          variant: "default",
          title: "Quantity Updated ✨",
          description: `${productName} is already in your cart. Quantity increased to ${cartItem.quantity}.`,
          duration: 3000,
        });
      } else {
        // New item added - set timer for this item and redirect
        // Set timer for this new cart item (starts countdown)
        setCartItemTimer(cartItem.id);
        
        toast({
          variant: "success",
          title: "Product Added to Cart! 🎉",
          description: "Redirecting to cart...",
          duration: 2000,
        });
        
        // Redirect to cart page after a short delay
        setTimeout(() => {
          router.push("/user/cart");
        }, 500);
      }
    } else {
      // Handle different error scenarios
      const errorMessage = result.error || "Failed to add item to cart";
      
      if (errorMessage.includes("sold") || errorMessage.includes("already been sold")) {
        toast({
          variant: "destructive",
          title: "Not Available ❌",
          description: "This product has already been sold and is no longer available.",
          duration: 4000,
        });
      } else if (
        errorMessage.includes("being processed") || 
        errorMessage.includes("Pending") ||
        errorMessage.includes("currently being processed")
      ) {
        toast({
          variant: "destructive",
          title: "Currently Unavailable ⏳",
          description: "This product is being processed and cannot be added to cart right now.",
          duration: 4000,
        });
      } else if (errorMessage.includes("not found")) {
        toast({
          variant: "destructive",
          title: "Product Not Found",
          description: "The product you're trying to add is no longer available.",
          duration: 4000,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
          duration: 4000,
        });
      }
    }
    
    return result;
  };

  return (
    <ActionButton
      action={handleAddToCart}
      loadingText="Adding..."
      className="mt-2 bg-primary hover:bg-primary/90 text-white flex items-center gap-2 px-4 py-2 rounded-full shadow transition-transform duration-150 active:scale-95"
      icon={<ShoppingCart className="w-4 h-4" />}
    >
      Add to Cart
    </ActionButton>
  );
}

