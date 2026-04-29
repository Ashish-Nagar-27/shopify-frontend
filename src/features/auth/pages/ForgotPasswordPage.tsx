import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AuthLayout } from "../components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { authApi } from "../api/authApi";

const forgotPasswordSchema = z.object({
    email: z.string().email("Enter a valid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const form = useForm<ForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(data: ForgotPasswordValues) {
        setIsLoading(true);
        setStatusMessage(null);
        try {
            const response = await authApi.forgotPassword(data.email);
            
            const successMessage = response.message || "Check Your Email";
            setStatusMessage({ type: 'success', message: successMessage });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Failed to send reset email";
            setStatusMessage({ type: 'error', message: errorMessage });
            console.error("Error in forgotPassword:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AuthLayout
            title="Reset your password"
            subtitle="Enter your email address and we'll send you a link to reset your password."
        >
            {statusMessage?.type === 'success' ? (
                <div className="space-y-6">
                    <div className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary text-center">
                        {statusMessage.message}
                    </div>
                    <Button asChild className="w-full">
                        <Link to="/login">Back to Sign In</Link>
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
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="you@example.com"
                                            type="email"
                                            {...field}
                                        />
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
                                    Sending instructions…
                                </span>
                            ) : (
                                "Send reset instructions"
                            )}
                        </Button>

                        <p className="text-center text-sm text-muted-foreground">
                            Remember your password?{" "}
                            <Link
                                to="/login"
                                className="font-medium text-primary transition-colors hover:text-primary/80"
                            >
                                Sign in
                            </Link>
                        </p>
                    </form>
                </Form>
            )}
        </AuthLayout>
    );
}
