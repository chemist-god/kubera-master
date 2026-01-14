"use client";

import { useState } from "react";
import { Product } from "@/lib/api/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Wallet, ArrowRight } from "lucide-react";
import { getBankLogo } from "@/lib/utils/bank-logos";
import Image from "next/image";
import { ProductDetailsModal } from "./product-details-modal";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const bankLogo = getBankLogo(product.bank);

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className="group relative h-full"
        onClick={() => setIsModalOpen(true)}
      >
        <div className={cn(
          "relative h-full overflow-hidden rounded-2xl border border-border/50",
          "bg-card/50 backdrop-blur-sm",
          "transition-all duration-300",
          "hover:border-primary/20 hover:shadow-lg hover:bg-card/80",
          "flex flex-col"
        )}>
          {/* Top Section with Logo & Status */}
          <div className="p-5 flex items-start justify-between gap-4">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center p-2 shadow-sm ring-1 ring-border/50 transition-colors",
              "bg-background"
            )}>
              {bankLogo ? (
                <Image
                  src={bankLogo}
                  alt={product.bank}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              ) : (
                <Building2 className="w-6 h-6 text-muted-foreground" />
              )}
            </div>

            <Badge
              variant="secondary"
              className={cn(
                "font-medium border-transparent",
                product.status === "Available"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
              )}
            >
              {product.status}
            </Badge>
          </div>

          {/* Main Info */}
          <div className="px-5 pb-2 flex-1 space-y-3">
            <div>
              <h3 className="text-lg font-bold tracking-tight text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">{product.type}</p>
            </div>

            <div className="flex flex-wrap gap-y-1 gap-x-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 opacity-70" />
                <span className="truncate max-w-[100px]">{product.bank}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 opacity-70" />
                <span className="truncate max-w-[100px]">{product.region}</span>
              </div>
            </div>
          </div>

          {/* Footer / Stats */}
          <div className="mt-4 p-5 pt-4 border-t border-border/50 bg-muted/20">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Price</p>
                <div className="text-xl font-bold text-primary tracking-tight">
                  ${product.price.toLocaleString()}
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Balance</p>
                <div className="text-base font-semibold text-foreground tracking-tight flex items-center justify-end gap-1">
                  <Wallet className="w-3.5 h-3.5 text-muted-foreground" />
                  ${product.balance.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1">
              <Button
                size="sm"
                variant="outline"
                className="w-full bg-background/50 border-border/50 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 group/btn"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <ProductDetailsModal
        product={product}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}
