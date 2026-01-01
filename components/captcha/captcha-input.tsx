"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { generateCaptchaChallenge } from "@/lib/actions/captcha";

interface CaptchaInputProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    error?: string | null;
}

export function CaptchaInput({ value, onChange, disabled, error }: CaptchaInputProps) {
    const [question, setQuestion] = useState<string>("Loading...");
    const [isRefreshing, setIsRefreshing] = useState(false);

    async function loadCaptcha() {
        setIsRefreshing(true);
        try {
            const result = await generateCaptchaChallenge();
            if (result.success && result.data) {
                setQuestion(result.data.question);
                onChange(""); // Clear the input when refreshing
            } else {
                setQuestion("Error loading CAPTCHA");
            }
        } catch (error) {
            console.error("Error loading CAPTCHA:", error);
            setQuestion("Error loading CAPTCHA");
        } finally {
            setIsRefreshing(false);
        }
    }

    useEffect(() => {
        loadCaptcha();
    }, []);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground whitespace-nowrap">
                        {question} = ?
                    </span>
                    <Input
                        className="w-24"
                        type="number"
                        placeholder="Answer"
                        required
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={disabled || isRefreshing}
                    />
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={loadCaptcha}
                    disabled={disabled || isRefreshing}
                    className="p-2"
                    title="Refresh CAPTCHA"
                >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                </Button>
            </div>
            {error && (
                <p className="text-xs text-red-400">{error}</p>
            )}
        </div>
    );
}

