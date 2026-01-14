"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, X, Check } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ShopFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Basic State
    const [search, setSearch] = useState(searchParams.get("q") || "");
    const [region, setRegion] = useState(searchParams.get("region") || "all");
    const [price, setPrice] = useState(searchParams.get("price") || "all");

    // Advanced State
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
    const [selectedBanks, setSelectedBanks] = useState<string[]>(
        searchParams.get("banks")?.split(",").filter(Boolean) || []
    );
    const [minBal, setMinBal] = useState(searchParams.get("min") || "");
    const [maxBal, setMaxBal] = useState(searchParams.get("max") || "");

    // Debounce search
    useEffect(() => {
        const timeout = setTimeout(() => {
            // Only update search query on debounce, other filters update immediately/on-apply
            const params = new URLSearchParams(searchParams.toString());
            if (search) params.set("q", search);
            else params.delete("q");
            router.push(`/shop?${params.toString()}`, { scroll: false });
        }, 300);
        return () => clearTimeout(timeout);
    }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

    // Helper to push updates
    const updateParams = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === "" || value === "all") {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });
        router.push(`/shop?${params.toString()}`, { scroll: false });
    };

    const handleRegionChange = (val: string) => {
        setRegion(val);
        updateParams({ region: val });
    };

    const handlePriceChange = (val: string) => {
        setPrice(val);
        updateParams({ price: val });
    };

    const toggleBank = (bank: string) => {
        setSelectedBanks(prev =>
            prev.includes(bank) ? prev.filter(b => b !== bank) : [...prev, bank]
        );
    };

    const applyAdvancedFilters = () => {
        updateParams({
            banks: selectedBanks.length > 0 ? selectedBanks.join(",") : null,
            min: minBal,
            max: maxBal,
        });
        setIsAdvancedOpen(false);
    };

    const clearFilters = () => {
        setSearch("");
        setRegion("all");
        setPrice("all");
        setSelectedBanks([]);
        setMinBal("");
        setMaxBal("");
        router.push("/shop");
    };

    const activeFilterCount = [
        searchParams.get("q"),
        searchParams.get("region") !== "all" ? "region" : null,
        searchParams.get("price") !== "all" ? "price" : null,
        searchParams.get("banks") ? "banks" : null,
        searchParams.get("min") ? "min" : null,
        searchParams.get("max") ? "max" : null,
    ].filter(Boolean).length;

    return (
        <div className="w-full">
            <div className="bg-background/80 backdrop-blur-xl border border-border/50 shadow-sm rounded-2xl p-3 flex flex-col md:flex-row gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        className="pl-10 h-10 bg-muted/40 border-border/50 focus-visible:bg-background transition-colors"
                        placeholder="Search products, bins, or banks..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    )}
                </div>

                {/* Filters Group */}
                <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 px-1 md:px-0 no-scrollbar items-center">
                    <Select value={region} onValueChange={handleRegionChange}>
                        <SelectTrigger className="w-[140px] h-10 bg-muted/40 border-border/50">
                            <SelectValue placeholder="Region" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Regions</SelectItem>
                            <SelectItem value="USA">USA</SelectItem>
                            <SelectItem value="UK">UK</SelectItem>
                            <SelectItem value="Canada">Canada</SelectItem>
                            <SelectItem value="EU">Europe</SelectItem>
                            <SelectItem value="Asia">Asia</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={price} onValueChange={handlePriceChange}>
                        <SelectTrigger className="w-[140px] h-10 bg-muted/40 border-border/50">
                            <SelectValue placeholder="Price" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Prices</SelectItem>
                            <SelectItem value="asc">Low to High</SelectItem>
                            <SelectItem value="desc">High to Low</SelectItem>
                        </SelectContent>
                    </Select>

                    <Sheet open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="h-10 px-4 gap-2 bg-muted/40 border-border/50 hover:bg-muted/60 relative">
                                <SlidersHorizontal className="w-4 h-4" />
                                <span className="hidden sm:inline">Advanced</span>
                                {activeFilterCount > 0 && (
                                    <Badge variant="secondary" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] border-2 border-background">
                                        {activeFilterCount}
                                    </Badge>
                                )}
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="overflow-y-auto w-full sm:max-w-md">
                            <SheetHeader>
                                <SheetTitle>Advanced Filters</SheetTitle>
                                <SheetDescription>
                                    Refine your search with specific parameters.
                                </SheetDescription>
                            </SheetHeader>
                            <div className="py-6 space-y-8 px-1">
                                {/* Bank Type Selection */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-medium leading-none">Bank Type</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['Chase', 'BOA', 'Wells', 'Citi', 'Barclays', 'Chime'].map(bank => {
                                            const isSelected = selectedBanks.includes(bank);
                                            return (
                                                <div
                                                    key={bank}
                                                    onClick={() => toggleBank(bank)}
                                                    className={cn(
                                                        "flex items-center space-x-3 border rounded-xl p-3 cursor-pointer transition-all duration-200 select-none",
                                                        isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:bg-muted/50"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "h-5 w-5 shrink-0 rounded border flex items-center justify-center transition-colors",
                                                        isSelected ? "bg-primary border-primary" : "border-muted-foreground"
                                                    )}>
                                                        {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                                                    </div>
                                                    <span className="text-sm font-medium">{bank}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Balance Range */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-medium leading-none">Balance Range</h4>
                                    <div className="flex items-end gap-3">
                                        <div className="space-y-2 flex-1">
                                            <label className="text-xs font-medium text-muted-foreground">Minimum</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                                                <Input
                                                    placeholder="0"
                                                    type="number"
                                                    className="pl-7 h-11 bg-background"
                                                    value={minBal}
                                                    onChange={(e) => setMinBal(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="pb-3 text-muted-foreground font-medium">-</div>
                                        <div className="space-y-2 flex-1">
                                            <label className="text-xs font-medium text-muted-foreground">Maximum</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                                                <Input
                                                    placeholder="Any"
                                                    type="number"
                                                    className="pl-7 h-11 bg-background"
                                                    value={maxBal}
                                                    onChange={(e) => setMaxBal(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="flex flex-col gap-3 pt-6 border-t border-border/50">
                                    <Button className="w-full h-11 font-medium text-base shadow-sm" onClick={applyAdvancedFilters}>
                                        Apply Filters
                                    </Button>
                                    <Button variant="ghost" className="w-full text-muted-foreground hover:text-destructive h-auto py-2" onClick={clearFilters}>
                                        Reset All Filters
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Only show 'Active Filters' row if there are HIDDEN filters active (Advanced) */}
            {(selectedBanks.length > 0 || minBal || maxBal) && (
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground animate-in fade-in slide-in-from-top-2">
                    <span>Applied:</span>
                    {selectedBanks.length > 0 && (
                        <Badge variant="secondary" className="px-2 py-0.5 text-xs">Banks: {selectedBanks.join(", ")}</Badge>
                    )}
                    {(minBal || maxBal) && (
                        <Badge variant="secondary" className="px-2 py-0.5 text-xs">Balance: ${minBal || "0"} - ${maxBal || "∞"}</Badge>
                    )}
                    <button onClick={clearFilters} className="text-xs hover:text-primary transition-colors ml-2 underline decoration-dashed">
                        Clear all
                    </button>
                </div>
            )}
        </div>
    );
}
