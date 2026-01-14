"use client";

import { useEffect, useRef, useState } from "react";
import { Clock } from "lucide-react";
import {
    getCartItemTimer,
    getTimerDuration,
} from "@/lib/utils/cart-timers";

interface CountdownTimerProps {
    cartItemId: string;
    onExpired: () => void;
}

/**
 * Countdown Timer Component (Per-Item)
 * 
 * Features:
 * - Each cart item has its own independent 10-minute timer
 * - Starts when item is first added to cart
 * - Counts down in real-time
 * - Persists across page refreshes and navigation
 * - Changes to red/blinking when < 2 minutes
 * - Shows "EXPIRED" when reaches 0
 * - Triggers callback when expired (removes only that item)
 */
export function CountdownTimer({
    cartItemId,
    onExpired,
}: CountdownTimerProps) {
    const durationMinutes = getTimerDuration();
    const startTimeRef = useRef<number | null>(null);
    const hasTriggeredExpiredRef = useRef(false);

    const [timeRemaining, setTimeRemaining] = useState<number>(durationMinutes * 60);
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        startTimeRef.current = getCartItemTimer(cartItemId);
        hasTriggeredExpiredRef.current = false;

        const tick = () => {
            const startTime = startTimeRef.current;
            if (!startTime) {
                return;
            }

            const now = Date.now();
            const elapsed = Math.floor((now - startTime) / 1000); // elapsed seconds
            const totalDuration = durationMinutes * 60; // total duration in seconds
            const remaining = Math.max(0, totalDuration - elapsed);

            setTimeRemaining(remaining);

            if (remaining <= 0 && !hasTriggeredExpiredRef.current) {
                hasTriggeredExpiredRef.current = true;
                setIsExpired(true);
                onExpired();
            }
        };

        const interval = setInterval(tick, 1000);
        const timeout = setTimeout(tick, 0);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [cartItemId, durationMinutes, onExpired]);

    // Format time as MM:SS
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    // Check if time is critical (< 2 minutes)
    const isCritical = timeRemaining < 120 && timeRemaining > 0; // Less than 2 minutes

    if (isExpired || timeRemaining <= 0) {
        return (
            <div className="flex items-center gap-1 text-destructive font-semibold animate-pulse">
                <Clock className="h-3 w-3" />
                <span>EXPIRED</span>
            </div>
        );
    }

    return (
        <div
            className={`flex items-center gap-1 text-xs transition-colors ${isCritical
                ? "text-destructive font-semibold animate-pulse"
                : "text-muted-foreground"
                }`}
        >
            <Clock className="h-3 w-3" />
            <span className={isCritical ? "font-bold" : ""}>
                {formatTime(timeRemaining)}
            </span>
        </div>
    );
}

