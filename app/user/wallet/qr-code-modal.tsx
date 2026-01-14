"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import QRCodeSVG from "react-qr-code";

interface QRCodeModalProps {
    address: string;
    onClose: () => void;
}

export function QRCodeModal({ address, onClose }: QRCodeModalProps) {
    const [focusedQR, setFocusedQR] = useState(false);
    const label = "Kubera Wallet";
    const message = "Top up balance";
    // Create Bitcoin URI format with label and message for better wallet experience
    const bitcoinURI = `bitcoin:${address}?label=${encodeURIComponent(label)}&message=${encodeURIComponent(message)}`;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={onClose}
        >
            <div
                className="relative bg-background/85 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 sm:p-8 w-full max-w-md max-h-[92vh] overflow-auto shadow-2xl ring-1 ring-white/20 animate-in zoom-in-95 duration-300 flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Logo / Brand Header */}
                <div className="mb-5 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 ring-4 ring-primary/5">
                        <span className="text-xl font-bold text-primary">K</span>
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight text-foreground">Scan to Top Up</h3>
                    <p className="text-sm text-muted-foreground font-medium">Bitcoin (BTC) only</p>
                </div>

                {/* QR Code Container with Center Logo Overlay / Custom Design */}
                <button
                    type="button"
                    onClick={() => setFocusedQR((prev) => !prev)}
                    aria-pressed={focusedQR}
                    className="relative group outline-none"
                >
                    <div className="relative p-4 sm:p-5 bg-white rounded-[1.75rem] shadow-xl ring-1 ring-black/5 mb-4">
                        <div className="absolute -inset-2 rounded-[2rem] bg-gradient-to-br from-primary/20 via-transparent to-primary/10 blur-sm pointer-events-none" />
                        <div className="relative w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] md:w-[280px] md:h-[280px]">
                            <QRCodeSVG
                                value={bitcoinURI}
                                size={280}
                                level="H"
                                bgColor="#FFFFFF"
                                fgColor="#0C0D0F"
                                className="w-full h-full"
                            />
                            {/* Centered Logo Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full flex items-center justify-center shadow-md p-1 ring-2 ring-primary/20">
                                    <div className="w-full h-full bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                                        K
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-xs text-muted-foreground text-center -mt-1 mb-4">
                        {focusedQR ? "Tap to return to details" : "Tap QR for focused view"}
                    </div>
                </button>

                {/* Address Display */}
                {!focusedQR && (
                    <div className="w-full space-y-4">
                        <div className="flex items-center gap-2 p-3 rounded-2xl bg-muted/40 border border-white/5 shadow-inner">
                            <code className="flex-1 text-xs font-mono text-center text-muted-foreground break-all tracking-wide select-all">
                                {address}
                            </code>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="rounded-2xl border border-white/10 bg-background/40 p-3">
                                <p className="text-muted-foreground mb-1">Network</p>
                                <p className="font-semibold text-foreground">Bitcoin (BTC)</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-background/40 p-3">
                                <p className="text-muted-foreground mb-1">Recipient</p>
                                <p className="font-semibold text-foreground">{label}</p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-700">
                            Your wallet will open a payment screen with this address, label, and message. Amount is optional and set in your wallet.
                        </div>
                    </div>
                )}

                <div className="w-full mt-2 flex gap-2">
                    {focusedQR ? (
                        <Button
                            variant="outline"
                            className="flex-1 rounded-xl h-11 border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors font-semibold"
                            onClick={() => setFocusedQR(false)}
                        >
                            Back to Details
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            className="flex-1 rounded-xl h-11 border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors font-semibold"
                            onClick={() => {
                                navigator.clipboard.writeText(address);
                            }}
                        >
                            Copy Address
                        </Button>
                    )}
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
    );
}

