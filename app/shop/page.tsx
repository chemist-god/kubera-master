import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart } from "lucide-react";
import { getProducts } from "@/lib/actions/products";
import { AddToCartButton } from "./add-to-cart-button";

export default async function ShopPage() {
  const result = await getProducts();
  const products = result.success && result.data ? result.data : [];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <div className="w-full max-w-4xl p-8">
        <h1 className="text-4xl font-bold mb-4">Shop</h1>
        <div className="mb-6 flex gap-4">
          <Input className="w-64" placeholder="Search products..." />
          <select className="bg-card rounded px-4 py-2 text-foreground">
            <option>All Regions</option>
          </select>
          <select className="bg-card rounded px-4 py-2 text-foreground">
            <option>All Banks</option>
          </select>
          <select className="bg-card rounded px-4 py-2 text-foreground">
            <option>All Prices</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.length === 0 ? (
            <div className="col-span-2 text-center text-muted-foreground py-8">
              No products available
            </div>
          ) : (
            products.map((product) => (
              <Card key={product.id} className="p-6 flex flex-col gap-2">
                <CardHeader>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-primary font-bold text-xl">
                    ${product.balance.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground block">
                    Price:{" "}
                    <span className="text-foreground font-semibold">
                      ${product.price}
                    </span>
                  </span>
                  <span className="text-xs text-primary block">
                    {product.status}
                  </span>
                  <AddToCartButton productId={product.id} />
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
