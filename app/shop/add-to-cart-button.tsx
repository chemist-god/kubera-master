"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { addToCart } from "@/lib/actions/cart";
import { useState } from "react";

export function AddToCartButton({ productId }: { productId: string }) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleAddToCart() {
    setIsLoading(true);
    try {
      const result = await addToCart(productId, 1);
      if (result.success) {
        // Could show a toast notification here
        console.log("Added to cart");
      } else {
        console.error("Failed to add to cart:", result.error);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isLoading}
      className="mt-2 bg-primary hover:bg-primary/90 text-white flex items-center gap-2 px-4 py-2 rounded-full shadow transition-transform duration-150 active:scale-95"
    >
      <ShoppingCart className="w-4 h-4" />
      {isLoading ? "Adding..." : "Add to Cart"}
    </Button>
  );
}

