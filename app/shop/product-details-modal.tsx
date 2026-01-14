"use client";

import { Product } from "@/lib/api/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { getBankLogo } from "@/lib/utils/bank-logos";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Banknote, MapPin, Building2, Wallet, ShieldCheck, Calendar } from "lucide-react";
import { AddToCartButton } from "./add-to-cart-button";
import { Button } from "@/components/ui/button";

interface ProductDetailsModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductDetailsModal({ product, open, onOpenChange }: ProductDetailsModalProps) {
  if (!product) return null;

  const bankLogo = getBankLogo(product.bank);
  const formatDate = (date: Date) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => onOpenChange(nextOpen)}
    >
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        {/* Premium header with subtle visual texture */}
        <div className="relative overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
          <div className="absolute -top-24 -right-24 size-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 size-80 rounded-full bg-accent/10 blur-3xl" />

          <div className="relative p-7 sm:p-10">
            <DialogHeader className="gap-5">
              <div className="flex items-start gap-5 sm:gap-6">
                <div className="shrink-0">
                  {bankLogo ? (
                    <div className="relative size-16 sm:size-20 rounded-3xl bg-white shadow-lg flex items-center justify-center p-3 ring-1 ring-black/5">
                      <Image
                        src={bankLogo}
                        alt={product.bank}
                        width={72}
                        height={72}
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="size-16 sm:size-20 rounded-3xl bg-muted/40 border border-border/60 flex items-center justify-center">
                      <Building2 className="size-7 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <DialogTitle className="text-2xl sm:text-3xl tracking-tight">
                        {product.name}
                      </DialogTitle>
                      <DialogDescription className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="inline-flex items-center gap-1.5">
                          <Building2 className="size-4" />
                          <span className="font-medium text-foreground/90">{product.bank}</span>
                        </span>
                        <span className="text-muted-foreground/50">•</span>
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="size-4" />
                          <span>{product.region}</span>
                        </span>
                        <span className="text-muted-foreground/50">•</span>
                        <span className="font-medium">{product.type}</span>
                      </DialogDescription>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <Badge
                        variant={product.status === "Available" ? "default" : "secondary"}
                        className="px-3 py-1 text-sm font-medium shadow-sm"
                      >
                        {product.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-5 inline-flex items-baseline gap-3 bg-background/60 backdrop-blur-sm px-4 py-2.5 rounded-3xl border border-border/60 shadow-sm">
                    <span className="text-3xl sm:text-4xl font-semibold tracking-tight text-primary">
                      ${product.price.toLocaleString()}
                    </span>
                    <span className="text-xs sm:text-sm text-muted-foreground">USD</span>
                  </div>
                </div>
              </div>
            </DialogHeader>
          </div>
        </div>

        {/* Content */}
        <div className="px-7 sm:px-10 py-7 sm:py-8 space-y-7">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-3xl border border-border/60 bg-muted/15 p-5">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-2xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/15">
                  <Wallet className="size-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Account balance</p>
                  <p className="text-2xl font-semibold tracking-tight text-foreground">
                    ${product.balance.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border/60 bg-muted/15 p-5">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-2xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/15">
                  <ShieldCheck className="size-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Account type</p>
                  <p className="text-2xl font-semibold tracking-tight text-foreground">
                    {product.type}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {product.description && (
            <div className="rounded-3xl border border-border/60 bg-card/30 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Banknote className="size-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-foreground">Product details</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          <Separator className="opacity-60" />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="size-3.5" />
              <span>Listed on {formatDate(product.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Last updated {formatDate(product.updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-muted/10 px-7 sm:px-10 py-6 border-t border-border/50">
          <DialogFooter className="flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
            <DialogClose
              render={<Button variant="outline" className="w-full sm:w-auto rounded-3xl" />}
            >
              Close
            </DialogClose>
            <div className="w-full sm:w-[260px]">
              <AddToCartButton
                productId={product.id}
                onAddedToCart={() => onOpenChange(false)}
              />
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
