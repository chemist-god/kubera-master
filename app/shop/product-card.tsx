"use client";

import { useState } from "react";
import { Product } from "@/lib/api/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Wallet, Sparkles, ArrowRight } from "lucide-react";
import { getBankLogo } from "@/lib/utils/bank-logos";
import Image from "next/image";
import { ProductDetailsModal } from "./product-details-modal";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        className="group relative h-full"
        onClick={() => setIsModalOpen(true)}
      >
        {/* Glassmorphic Card Container */}
        <div className={cn(
          "relative h-full overflow-hidden rounded-3xl border border-white/10",
          "bg-white/5 backdrop-blur-md",
          "transition-colors duration-300",
          "hover:bg-white/10 hover:border-white/20",
          "dark:bg-black/20 dark:hover:bg-black/30",
          "shadow-lg hover:shadow-xl"
        )}>
          {/* Decoratve Gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Content Area */}
          <div className="relative p-6 flex flex-col h-full gap-5">
            {/* Header */}
            <div className="flex justify-between items-start gap-3">
              <div className="relative">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center p-2.5 shadow-sm transition-transform duration-300 group-hover:scale-105",
                  product.bank ? "bg-white" : "bg-muted"
                )}>
                  {bankLogo ? (
                    <Image
                      src={bankLogo}
                      alt={product.bank}
                      width={64}
                      height={64}
                      className="object-contain"
                    />
                  ) : (
                    <Building2 className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                {/* Status Indicator */}
                <div className={cn(
                  "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-black",
                  product.status === "Available" ? "bg-emerald-500" : "bg-amber-500"
                )} />
              </div>
              
              <Badge 
                variant="outline" 
                className="backdrop-blur-sm bg-background/50 border-white/10 text-xs font-medium py-1 px-3"
              >
                {product.type}
              </Badge>
            </div>

            {/* Product Info */}
            <div className="flex-1 space-y-2">
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70 group-hover:to-primary transition duration-300 line-clamp-1">
                {product.name}
              </h3>
              
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="w-4 h-4 shrink-0 opacity-70" />
                  <span className="truncate">{product.bank}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 shrink-0 opacity-70" />
                  <span className="truncate">{product.region}</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />

            {/* Financials */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Balance</p>
                <div className="flex items-center gap-1.5 text-foreground font-semibold">
                  <Wallet className="w-4 h-4 text-primary opacity-80" />
                  <span>${product.balance.toLocaleString()}</span>
                </div>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</p>
                <p className="text-xl font-bold text-primary">
                  ${product.price.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Actions */}
            <Button
              className="w-full mt-2 group/btn relative overflow-hidden bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 shadow-none hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
            >
              <span className="relative z-10 flex items-center gap-2 font-medium">
                View Details
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-primary/10 translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-300" />
            </Button>
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
