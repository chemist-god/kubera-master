"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import QRCodeSVG from "react-qr-code";

interface QRCodeModalProps {
    address: string;
    onClose: () => void;
}

export function QRCodeModal({ address, onClose }: QRCodeModalProps) {
    // Create Bitcoin URI format with label and message for better wallet experience
    const bitcoinURI = `bitcoin:${address}?label=Kubera&message=Payment`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}>
            <div
                className="relative bg-background/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 max-w-sm w-full shadow-2xl ring-1 ring-white/20 animate-in zoom-in-95 duration-300 flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Logo / Brand Header */}
                <div className="mb-6 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 ring-4 ring-primary/5">
                        <span className="text-xl font-bold text-primary">K</span>
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight text-foreground">Scan to Pay</h3>
                    <p className="text-sm text-muted-foreground font-medium">Use your Bitcoin wallet app</p>
                </div>

                {/* QR Code Container with Center Logo Overlay / Custom Design */}
                <div className="relative p-6 bg-white rounded-3xl shadow-lg ring-1 ring-black/5 mb-6 group">
                    <QRCodeSVG
                        value={bitcoinURI}
                        size={220}
                        level="M" // Medium error correction allows for small logo overlay
                        className="w-full h-full"
                    />
                    {/* Centered Logo Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md p-1">
                            <div className="w-full h-full bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                                K
                            </div>
                        </div>
                    </div>
                </div>

                {/* Address Display */}
                <div className="w-full space-y-4">
                    <div className="flex items-center gap-2 p-3 rounded-2xl bg-muted/40 border border-white/5 shadow-inner">
                        <code className="flex-1 text-xs font-mono text-center text-muted-foreground break-all tracking-wide select-all">
                            {address}
                        </code>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="flex-1 rounded-xl h-11 border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors font-semibold"
                            onClick={() => {
                                navigator.clipboard.writeText(address);
                                // Optional: You might want to show a toast here, but we don't have access to toast in this component easily without props
                            }}
                        >
                            Copy Address
                        </Button>
                        <Button
                            variant="default"
                            className="flex-1 rounded-xl h-11 font-semibold shadow-lg shadow-primary/20"
                            onClick={onClose}
                        >
                            Done
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

