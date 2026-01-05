export const dynamic = "force-dynamic";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Wallet, Building2, MapPin, TrendingUp } from "lucide-react";
import { getProducts } from "@/lib/actions/products";
import { Product } from "@/lib/api/types";
import { ProductCard } from "./product-card";

export default async function ShopPage() {
  const result = await getProducts();
  const products: Product[] = result.success && result.data ? result.data : [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent mb-3">
                Premium Marketplace
              </h1>
              <p className="text-muted-foreground text-lg">
                Discover and acquire premium financial products
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-6 bg-card/50 backdrop-blur-sm px-6 py-3 rounded-2xl border border-border/50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-muted-foreground">{products.length} Available</span>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  className="pl-12 h-12 bg-background/50 border-border/50 rounded-xl text-base focus:ring-2 focus:ring-primary/20" 
                  placeholder="Search by name, bank, or region..." 
                />
              </div>
              <div className="flex gap-3">
                <select className="bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-foreground hover:border-primary/50 transition-colors focus:ring-2 focus:ring-primary/20 outline-none min-w-[140px]">
                  <option>All Regions</option>
                  <option>USA</option>
                  <option>UK</option>
                  <option>Canada</option>
                </select>
                <select className="bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-foreground hover:border-primary/50 transition-colors focus:ring-2 focus:ring-primary/20 outline-none min-w-[140px]">
                  <option>All Banks</option>
                </select>
                <select className="bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-foreground hover:border-primary/50 transition-colors focus:ring-2 focus:ring-primary/20 outline-none min-w-[140px]">
                  <option>All Prices</option>
                  <option>Under $1000</option>
                  <option>$1000 - $5000</option>
                  <option>Above $5000</option>
                </select>
              </div>
            </div>
          </Card>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <Card className="p-16 text-center bg-card/30 backdrop-blur-sm border-dashed">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
                <Wallet className="w-10 h-10 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No Products Available</h3>
                <p className="text-muted-foreground">Check back soon for new listings</p>
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Stats Footer */}
        {products.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{products.length}</p>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {new Set(products.map(p => p.bank)).size}
                  </p>
                  <p className="text-sm text-muted-foreground">Financial Institutions</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {new Set(products.map(p => p.region)).size}
                  </p>
                  <p className="text-sm text-muted-foreground">Regions Available</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
