"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { register } from "@/lib/actions/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/utils/constants";
import { CaptchaInput } from "@/components/captcha/captcha-input";

export function RegisterForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        captchaAnswer: "",
        agreeToTerms: false,
    });

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const result = await register({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
                captchaAnswer: formData.captchaAnswer,
                agreeToTerms: formData.agreeToTerms,
            });

            if (result.success && result.data) {
                // Redirect to login with success message
                router.push(`${ROUTES.LOGIN}?registered=true`);
            } else {
                setError(result.error || "Registration failed. Please try again.");
            }
        } catch (err) {
            console.error("Registration form error:", err);
            setError("An unexpected error occurred. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                </div>
            )}
            <Input
                placeholder="Username"
                required
                value={formData.username}
                onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                }
                disabled={isLoading}
                minLength={3}
                maxLength={20}
                className="h-11 bg-muted/30 border-white/10 focus:bg-background focus:border-primary/50 transition-all rounded-xl"
            />
            <Input
                placeholder="Email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                }
                disabled={isLoading}
                className="h-11 bg-muted/30 border-white/10 focus:bg-background focus:border-primary/50 transition-all rounded-xl"
            />
            <Input
                placeholder="Password"
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                }
                disabled={isLoading}
                minLength={8}
                className="h-11 bg-muted/30 border-white/10 focus:bg-background focus:border-primary/50 transition-all rounded-xl"
            />
            <Input
                placeholder="Confirm Password"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                }
                disabled={isLoading}
                minLength={8}
                className="h-11 bg-muted/30 border-white/10 focus:bg-background focus:border-primary/50 transition-all rounded-xl"
            />
            <CaptchaInput
                value={formData.captchaAnswer}
                onChange={(value) => setFormData({ ...formData, captchaAnswer: value })}
                disabled={isLoading}
                error={error && (error.toLowerCase().includes("captcha") || error.toLowerCase().includes("expired")) ? error : null}
            />
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    required
                    className="accent-primary"
                    id="tos"
                    checked={formData.agreeToTerms}
                    onChange={(e) =>
                        setFormData({ ...formData, agreeToTerms: e.target.checked })
                    }
                    disabled={isLoading}
                />
                <label htmlFor="tos" className="text-xs text-muted-foreground">
                    I agree to the{" "}
                    <a href="#" className="text-primary hover:underline">
                        Terms of Service
                    </a>
                </label>
            </div>
            <Button className="w-full mt-4 h-11 text-base font-medium rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all" type="submit" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
        </form>
    );
}

