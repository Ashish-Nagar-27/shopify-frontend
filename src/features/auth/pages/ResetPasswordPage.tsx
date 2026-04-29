import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AuthLayout } from "../components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { authApi } from "../api/authApi";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

const resetPasswordSchema = z
    .object({
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    // Extract token right after the `?`
    // Example: ?xyz123 -> xyz123
    const token = location.search ? location.search.substring(1) : "";

    useEffect(() => {
        if (!token) {
            navigate("/forgot-password", { replace: true });
        }
    }, [token, navigate]);

    const form = useForm<ResetPasswordValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(data: ResetPasswordValues) {
        if (!token) return;

        setIsLoading(true);
        setStatusMessage(null);
        try {
            const response = await authApi.resetPassword({
                refreshtoken: token,
                newpassword: data.password
            });
            
            const successMessage = response.message || "Password successfully reset";
            setStatusMessage({ type: 'success', message: successMessage });
            
            // Redirect to login after a few seconds so user can login with new credentials
            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 3000);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Failed to reset password. The link might be expired or invalid.";
            setStatusMessage({ type: 'error', message: errorMessage });
            console.error("Error in resetPassword:", error);
        } finally {
            setIsLoading(false);
        }
    }

    if (!token) {
        return null;
    }

    return (
        <AuthLayout
            title="Create new password"
            subtitle="Please enter and confirm your new password below."
        >
            {statusMessage?.type === 'success' ? (
                <div className="space-y-6">
                    <div className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary text-center">
                        {statusMessage.message}
                    </div>
                    <Button asChild className="w-full">
                        <Link to="/login">Go to Sign In</Link>
                    </Button>
                </div>
            ) : (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        {statusMessage?.type === 'error' && (
                            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                                {statusMessage.message}
                            </div>
                        )}
                        
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                placeholder="••••••••"
                                                type={showPassword ? "text" : "password"}
                                                {...field}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm New Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                placeholder="••••••••"
                                                type={showConfirmPassword ? "text" : "password"}
                                                {...field}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg
                                        className="h-4 w-4 animate-spin"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                        />
                                    </svg>
                                    Resetting password…
                                </span>
                            ) : (
                                "Reset Password"
                            )}
                        </Button>
                    </form>
                </Form>
            )}
        </AuthLayout>
    );
}
