"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/app/shop/add-to-cart-button";
import { BankLog } from "@/lib/api/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getBankLogo } from "@/lib/utils/bank-logos";

const ITEMS_PER_PAGE = 6;
const POLLING_INTERVAL = 4000; // 4 seconds (less than 5s as requested)

interface BankLogsTableProps {
  initialData?: BankLog[];
  cartProductIds?: Set<string>;
}

export function BankLogsTable({ initialData = [], cartProductIds = new Set() }: BankLogsTableProps) {
  const [bankLogs, setBankLogs] = useState<BankLog[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedBank, setSelectedBank] = useState("All Banks");
  const [selectedPriceRange, setSelectedPriceRange] = useState("All Prices");
  const [currentPage, setCurrentPage] = useState(1);
  const [inCartProducts, setInCartProducts] = useState<Set<string>>(cartProductIds);

  // Fetch bank logs from API
  const fetchBankLogs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/bank-logs");
      if (response.ok) {
        const result = await response.json();
        // API handler wraps response in { data: ... }
        const data = result.data || result;
        // Ensure it's an array
        if (Array.isArray(data)) {
          setBankLogs(data);
        } else {
          console.error("Invalid data format:", data);
          setBankLogs([]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch bank logs:", error);
      setBankLogs([]);
    } finally {
      setLoading(false);
    }
  };

  // Real-time polling for bank logs
  useEffect(() => {
    // Initial fetch
    fetchBankLogs();

    // Set up polling interval
    const interval = setInterval(() => {
      fetchBankLogs();
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  // Fetch cart items to update "in cart" state
  const fetchCartState = async () => {
    try {
      const response = await fetch("/api/cart");
      if (response.ok) {
        const result = await response.json();
        const cartItems = result.data || result;
        if (Array.isArray(cartItems)) {
          const productIds = new Set(
            (cartItems as Array<{ productId: string }>).map((item) => item.productId)
          );
          setInCartProducts(productIds);
        }
      }
    } catch (error) {
      console.error("Failed to fetch cart state:", error);
    }
  };

  // Poll cart state periodically to update button states
  useEffect(() => {
    // Initial fetch
    fetchCartState();

    // Poll cart state every 5 seconds (less frequent than bank logs)
    const cartInterval = setInterval(() => {
      fetchCartState();
    }, 5000);

    return () => clearInterval(cartInterval);
  }, []);

  // Extract unique values for filters
  const regions = useMemo(() => {
    if (!Array.isArray(bankLogs) || bankLogs.length === 0) {
      return ["All Regions"];
    }
    const uniqueRegions = Array.from(
      new Set(bankLogs.map((log) => log.region))
    ).sort();
    return ["All Regions", ...uniqueRegions];
  }, [bankLogs]);

  const banks = useMemo(() => {
    if (!Array.isArray(bankLogs) || bankLogs.length === 0) {
      return ["All Banks"];
    }
    const uniqueBanks = Array.from(
      new Set(bankLogs.map((log) => log.bank))
    ).sort();
    return ["All Banks", ...uniqueBanks];
  }, [bankLogs]);

  // Price ranges
  const priceRanges = [
    "All Prices",
    "$0 - $150",
    "$150 - $250",
    "$250 - $400",
    "$400 - $600",
    "$600 - $800",
    "$800+",
  ];

  // Client-side filtering
  const filteredLogs = useMemo(() => {
    if (!Array.isArray(bankLogs) || bankLogs.length === 0) {
      return [];
    }
    let filtered = [...bankLogs];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          log.product.toLowerCase().includes(query) ||
          log.description.toLowerCase().includes(query) ||
          log.bank.toLowerCase().includes(query) ||
          log.type.toLowerCase().includes(query)
      );
    }

    // Region filter
    if (selectedRegion !== "All Regions") {
      filtered = filtered.filter((log) => log.region === selectedRegion);
    }

    // Bank filter
    if (selectedBank !== "All Banks") {
      filtered = filtered.filter((log) => log.bank === selectedBank);
    }

    // Price range filter
    if (selectedPriceRange !== "All Prices") {
      const [min, max] = (() => {
        switch (selectedPriceRange) {
          case "$0 - $150":
            return [0, 150];
          case "$150 - $250":
            return [150, 250];
          case "$250 - $400":
            return [250, 400];
          case "$400 - $600":
            return [400, 600];
          case "$600 - $800":
            return [600, 800];
          case "$800+":
            return [800, Infinity];
          default:
            return [0, Infinity];
        }
      })();

      filtered = filtered.filter(
        (log) => log.price >= min && log.price <= max
      );
    }

    return filtered;
  }, [bankLogs, searchQuery, selectedRegion, selectedBank, selectedPriceRange]);

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedRegion, selectedBank, selectedPriceRange]);

  // Generate pagination buttons with ellipsis
  const getPaginationButtons = () => {
    const buttons: (number | string)[] = [];
    const maxVisible = 7; // Show up to 7 page numbers

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(i);
      }
    } else {
      // Always show first page
      buttons.push(1);

      if (currentPage <= 3) {
        // Near the start
        for (let i = 2; i <= 5; i++) {
          buttons.push(i);
        }
        buttons.push("...");
        buttons.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        buttons.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          buttons.push(i);
        }
      } else {
        // In the middle
        buttons.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          buttons.push(i);
        }
        buttons.push("...");
        buttons.push(totalPages);
      }
    }

    return buttons;
  };

  // Get bank initials for badge
  const getBankInitials = (bankName: string) => {
    const words = bankName.split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return bankName.substring(0, 2).toUpperCase();
  };

  return (
    <div className="w-full">
      {/* Filters Section */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">
            Search
          </label>
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="min-w-[150px]">
          <label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">
            Region
          </label>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {regions.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="min-w-[150px]">
          <label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">
            Banks
          </label>
          <Select value={selectedBank} onValueChange={setSelectedBank}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {banks.map((bank) => (
                <SelectItem key={bank} value={bank}>
                  {bank}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="min-w-[150px]">
          <label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">
            Price Range
          </label>
          <Select
            value={selectedPriceRange}
            onValueChange={setSelectedPriceRange}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {priceRanges.map((range) => (
                <SelectItem key={range} value={range}>
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto rounded-xl shadow bg-card">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                Product
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                Description
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                Bank
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                Balance
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                Region
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                Status
              </th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading && paginatedLogs.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  Loading bank logs...
                </td>
              </tr>
            ) : paginatedLogs.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No bank logs available
                </td>
              </tr>
            ) : (
              paginatedLogs.map((log: BankLog) => (
                <tr
                  key={log.id}
                  className="hover:bg-muted/50 transition"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {(() => {
                        const logoPath = getBankLogo(log.bank);
                        return logoPath ? (
                          <div className="w-12 h-12 flex-shrink-0 rounded-full overflow-hidden bg-white border border-border/50 flex items-center justify-center relative">
                            <Image
                              src={logoPath}
                              alt={`${log.bank} logo`}
                              width={48}
                              height={48}
                              className="absolute inset-0 w-full h-full object-contain scale-125"
                            />
                          </div>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="rounded-full px-2 py-1 text-xs font-semibold bg-primary/10 text-primary"
                          >
                            {getBankInitials(log.bank)}
                          </Badge>
                        );
                      })()}
                      <div>
                        <div className="font-semibold text-sm">{log.product}</div>
                        <div className="text-xs text-muted-foreground">
                          {log.type}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 max-w-xs text-sm text-muted-foreground">
                    {log.description}
                  </td>
                  <td className="px-4 py-3 text-sm">{log.bank}</td>
                  <td className="px-4 py-3 text-primary font-bold">
                    ${log.balance.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-4 py-3 text-foreground font-semibold">
                    ${log.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {log.region}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="secondary"
                      className="text-xs font-semibold px-2 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 dark:bg-emerald-500/20"
                    >
                      {log.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <AddToCartButton
                      productId={log.id}
                      isInCart={inCartProducts.has(log.id)}
                      onAddedToCart={() => {
                        // Update local state immediately when item is added
                        setInCartProducts((prev) => new Set(prev).add(log.id));
                      }}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {getPaginationButtons().map((page, index) => {
              if (page === "...") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-3 py-1 text-muted-foreground"
                  >
                    ...
                  </span>
                );
              }

              const pageNum = page as number;
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`min-w-[40px] ${currentPage === pageNum
                    ? "bg-primary text-primary-foreground"
                    : ""
                    }`}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="flex items-center gap-1"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Results count */}
      <div className="mt-4 text-center text-sm text-muted-foreground">
        Showing {startIndex + 1} - {Math.min(endIndex, filteredLogs.length)} of{" "}
        {filteredLogs.length} results
      </div>
    </div>
  );
}

