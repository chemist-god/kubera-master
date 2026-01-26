"use client";

import { useState } from "react";
import { Copy, Check, Eye, EyeOff, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast, toastError } from "@/lib/utils/toast";
import { QRCodeModal } from "./qr-code-modal";

interface WalletAddressDisplayProps {
    address: string;
}

export function WalletAddressDisplay({ address }: WalletAddressDisplayProps) {
    const [copied, setCopied] = useState(false);
    const [showFull, setShowFull] = useState(false);
    const [showQR, setShowQR] = useState(false);

    // Format address: show first 10 + last 10 characters
    const formatAddress = (addr: string) => {
        if (addr.length <= 20) return addr;
        return `${addr.slice(0, 10)}...${addr.slice(-10)}`;
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(address);
            setCopied(true);
            toast.success("Address copied!", {
                description: "Bitcoin address has been copied to clipboard",
            });
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            toastError("Failed to copy", {
                description: "Please try again or copy manually",
            });
        }
    };

    return (
        <>
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-foreground">Bitcoin Address</h3>
                </div>

                <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-muted/30 border border-white/10 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                    <code className="flex-1 text-sm font-mono text-foreground break-all px-4 py-2 bg-transparent outline-none">
                        {showFull ? address : formatAddress(address)}
                    </code>

                    <div className="flex items-center gap-1 pr-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowFull(!showFull)}
                            className="h-9 w-9 rounded-xl hover:bg-background/80 hover:text-primary transition-colors"
                            aria-label={showFull ? "Hide full address" : "Show full address"}
                        >
                            {showFull ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleCopy}
                            className="h-9 w-9 rounded-xl hover:bg-background/80 hover:text-primary transition-colors"
                            aria-label="Copy address"
                        >
                            {copied ? (
                                <Check className="h-4 w-4 text-emerald-500" />
                            ) : (
                                <Copy className="h-4 w-4" />
                            )}
                        </Button>

                        <div className="w-px h-5 bg-border/50 mx-1" />

                        <Button
                            variant="default"
                            size="icon"
                            onClick={() => setShowQR(true)}
                            className="h-9 w-9 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground shadow-none transition-all"
                            aria-label="Show QR code"
                        >
                            <QrCode className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <p className="text-xs text-center md:text-left text-muted-foreground/80 flex items-center justify-center md:justify-start gap-1.5 px-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500/50 blink-animation" />
                    Only send Bitcoin (BTC) to this address. Other tokens will be lost.
                </p>
            </div>

            {showQR && (
                <QRCodeModal
                    address={address}
                    onClose={() => setShowQR(false)}
                />
            )}
        </>
    );
}

