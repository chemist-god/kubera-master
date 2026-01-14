import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import QRCodeSVG from "react-qr-code";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerClose,
    DrawerFooter,
} from "@/components/ui/drawer";
import { X } from "lucide-react";

interface QRCodeModalProps {
    address: string;
    onClose: () => void;
}

export function QRCodeModal({ address, onClose }: QRCodeModalProps) {
    const [open, setOpen] = useState(true);
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const [focusedQR, setFocusedQR] = useState(false);

    const label = "Kubera Wallet";
    const message = "Top up balance";
    const bitcoinURI = `bitcoin:${address}?label=${encodeURIComponent(
        label
    )}&message=${encodeURIComponent(message)}`;

    const handleOpenChange = (open: boolean) => {
        setOpen(open);
        if (!open) {
            onClose();
        }
    };

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogContent className="sm:max-w-md p-8 rounded-[2rem] border-white/10 bg-background/85 backdrop-blur-2xl shadow-2xl">
                    <div className="absolute right-4 top-4">
                        <DialogClose asChild>
                            <Button variant="ghost" size="icon" className="rounded-full opacity-70 hover:opacity-100">
                                <X className="w-4 h-4" />
                            </Button>
                        </DialogClose>
                    </div>
                    <DialogHeader className="mb-4">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center ring-4 ring-primary/5">
                                <span className="text-xl font-bold text-primary">K</span>
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold tracking-tight">Scan to Top Up</DialogTitle>
                                <p className="text-sm text-muted-foreground font-medium mt-1">Bitcoin (BTC) only</p>
                            </div>
                        </div>
                    </DialogHeader>
                    <QRCodeContent
                        address={address}
                        bitcoinURI={bitcoinURI}
                        focusedQR={focusedQR}
                        setFocusedQR={setFocusedQR}
                        label={label}
                        onClose={onClose}
                        isDesktop={true}
                    />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={handleOpenChange}>
            <DrawerContent className="bg-background/95 backdrop-blur-xl border-t border-white/10 rounded-t-[2rem] max-h-[85vh] flex flex-col">
                <DrawerHeader className="text-left pt-6 pb-2">
                    <div className="flex flex-col items-center text-center gap-4 w-full">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center ring-4 ring-primary/5">
                            <span className="text-xl font-bold text-primary">K</span>
                        </div>
                        <div>
                            <DrawerTitle className="text-2xl font-bold tracking-tight">Scan to Top Up</DrawerTitle>
                            <p className="text-sm text-muted-foreground font-medium mt-1">Bitcoin (BTC) only</p>
                        </div>
                    </div>
                </DrawerHeader>
                <div className="px-6 pb-6 overflow-y-auto flex-1">
                    <QRCodeContent
                        address={address}
                        bitcoinURI={bitcoinURI}
                        focusedQR={focusedQR}
                        setFocusedQR={setFocusedQR}
                        label={label}
                        onClose={onClose}
                        isDesktop={false}
                    />
                </div>
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline" className="w-full rounded-xl">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

function QRCodeContent({
    address,
    bitcoinURI,
    focusedQR,
    setFocusedQR,
    label,
    onClose,
    isDesktop
}: {
    address: string,
    bitcoinURI: string,
    focusedQR: boolean,
    setFocusedQR: (val: any) => void,
    label: string,
    onClose: () => void,
    isDesktop: boolean
}) {
    return (
        <div className="flex flex-col items-center w-full">
            <button
                type="button"
                onClick={() => setFocusedQR((prev: boolean) => !prev)}
                className="relative group outline-none w-full flex flex-col items-center"
            >
                <div className="relative p-5 bg-white rounded-[1.75rem] shadow-xl ring-1 ring-black/5 mb-4 max-w-[280px] w-full aspect-square">
                    <div className="absolute -inset-2 rounded-[2rem] bg-gradient-to-br from-primary/20 via-transparent to-primary/10 blur-sm pointer-events-none" />
                    <div className="relative w-full h-full">
                        <QRCodeSVG
                            value={bitcoinURI}
                            width="100%"
                            height="100%"
                            level="H"
                            bgColor="#FFFFFF"
                            fgColor="#0C0D0F"
                            className="w-full h-full"
                        />
                        {/* Centered Logo Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md p-1 ring-2 ring-primary/20">
                                <div className="w-full h-full bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                                    K
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-xs text-muted-foreground text-center mb-6">
                    {focusedQR ? "Tap to return to details" : "Tap QR for focused view"}
                </div>
            </button>

            {!focusedQR && (
                <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="flex items-center gap-2 p-3 rounded-2xl bg-muted/40 border border-white/5 shadow-inner">
                        <code className="flex-1 text-xs font-mono text-center text-muted-foreground break-all tracking-wide select-all">
                            {address}
                        </code>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="rounded-2xl border border-white/10 bg-background/40 p-3 text-center">
                            <p className="text-muted-foreground mb-1">Network</p>
                            <p className="font-semibold text-foreground">Bitcoin (BTC)</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-background/40 p-3 text-center">
                            <p className="text-muted-foreground mb-1">Recipient</p>
                            <p className="font-semibold text-foreground">{label}</p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-500 dark:text-amber-400 text-center">
                        Send only BTC to this address.
                    </div>
                </div>
            )}

            {isDesktop && (
                <div className="w-full mt-6 flex gap-2">
                    <Button
                        variant="outline"
                        className="flex-1 rounded-xl h-11 border-primary/20 hover:bg-primary/5 hover:text-primary"
                        onClick={() => navigator.clipboard.writeText(address)}
                    >
                        Copy
                    </Button>
                    <Button
                        variant="default"
                        className="flex-1 rounded-xl h-11 shadow-lg shadow-primary/20"
                        onClick={onClose}
                    >
                        Done
                    </Button>
                </div>
            )}
        </div>
    );
}

