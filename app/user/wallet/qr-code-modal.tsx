"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import QRCodeSVG from "react-qr-code";

interface QRCodeModalProps {
    address: string;
    onClose: () => void;
}

export function QRCodeModal({ address, onClose }: QRCodeModalProps) {
    // Create Bitcoin URI format
    const bitcoinURI = `bitcoin:${address}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative bg-card border border-border rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="absolute right-2 top-2"
                    aria-label="Close QR code"
                >
                    <X className="h-4 w-4" />
                </Button>

                <div className="flex flex-col items-center space-y-4">
                    <h3 className="text-lg font-semibold">Scan to Send Bitcoin</h3>

                    <div className="p-4 bg-white rounded-lg">
                        <QRCodeSVG
                            value={bitcoinURI}
                            size={256}
                            level="M"
                            includeMargin={true}
                        />
                    </div>

                    <div className="w-full space-y-2">
                        <p className="text-sm text-muted-foreground text-center">
                            Scan this QR code with your Bitcoin wallet to send funds
                        </p>
                        <code className="block text-xs font-mono text-center text-muted-foreground break-all p-2 bg-muted rounded">
                            {address}
                        </code>
                    </div>
                </div>
            </div>
        </div>
    );
}

