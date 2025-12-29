"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { register } from "@/lib/actions/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CAPTCHA_QUESTION = 19 + 18;
const CAPTCHA_ANSWER = 37;

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
                captchaExpected: CAPTCHA_ANSWER,
                agreeToTerms: formData.agreeToTerms,
            });

            if (result.success && result.data) {
                // Redirect to login with success message
                router.push("/login?registered=true");
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
            />
            <div className="flex items-center gap-2">
                <Input
                    className="w-24"
                    placeholder={`${CAPTCHA_QUESTION} = ?`}
                    required
                    value={formData.captchaAnswer}
                    onChange={(e) =>
                        setFormData({ ...formData, captchaAnswer: e.target.value })
                    }
                    disabled={isLoading}
                />
                <span className="text-xs text-muted-foreground">What's the answer?</span>
            </div>
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
            <Button className="w-full mt-2" type="submit" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
        </form>
    );
}

