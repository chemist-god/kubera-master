"use client";

import { ActionButton } from "@/components/common/action-button";
import { ShoppingCart } from "lucide-react";
import { addToCart } from "@/lib/actions/cart";

export function AddToCartButton({ productId }: { productId: string }) {
  return (
    <ActionButton
      action={async () => await addToCart(productId, 1)}
      loadingText="Adding..."
      className="mt-2 bg-primary hover:bg-primary/90 text-white flex items-center gap-2 px-4 py-2 rounded-full shadow transition-transform duration-150 active:scale-95"
      icon={<ShoppingCart className="w-4 h-4" />}
    >
      Add to Cart
    </ActionButton>
  );
}

