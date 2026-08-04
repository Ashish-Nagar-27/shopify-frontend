import { useState } from 'react';
import type { FallbackProps } from 'react-error-boundary';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, ChevronDown, ChevronUp, Copy, Check, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
    const [showDetails, setShowDetails] = useState(false);
    const [copied, setCopied] = useState(false);

    const errorString = error instanceof Error ? error.stack || error.message : String(error);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(errorString);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy error details', err);
        }
    };

    const handleGoHome = () => {
        window.location.href = '/';
    };

    return (
        <div className="flex min-h-[500px] w-full items-center justify-center p-4 bg-bg text-fg">
            <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-lg overflow-hidden rounded-xl border border-border-soft bg-surface p-6 shadow-card md:p-8"
            >
                {/* Decorative error gradient indicator on top edge */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-neg/60 via-neg to-neg/60" />

                <div className="flex flex-col items-center text-center gap-4">
                    {/* Glowing error icon container */}
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-neg-soft">
                        <span className="absolute inset-0 rounded-full bg-neg/10 animate-pulse opacity-75" />
                        <AlertTriangle className="h-7 w-7 text-neg" />
                    </div>

                    <div className="space-y-1.5">
                        <h2 className="font-sans text-xl font-bold tracking-tight text-fg md:text-2xl">
                            Application Error
                        </h2>
                        <p className="text-sm text-fg-mute max-w-sm mx-auto">
                            Something went wrong while rendering this section. You can try refreshing the component or go back to home.
                        </p>
                    </div>

                    {/* Quick message description box */}
                    <div className="w-full rounded-lg bg-bg-deep border border-border-soft px-4 py-3 text-left">
                        <span className="text-[10px] font-bold tracking-wider text-fg-faint uppercase font-sans">
                            Error Message
                        </span>
                        <p className="mt-1 font-mono text-xs font-semibold text-neg break-words">
                            {error instanceof Error ? error.message : String(error)}
                        </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-2.5 w-full mt-2">
                        <Button
                            onClick={resetErrorBoundary}
                            className="flex-1 font-medium bg-neg text-white hover:bg-neg/90 focus-visible:ring-neg/30 dark:bg-neg dark:hover:bg-neg/90 transition-all gap-2 h-10 cursor-pointer"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Try again
                        </Button>
                        <Button
                            onClick={handleGoHome}
                            variant="outline"
                            className="flex-1 font-medium border-border-soft hover:bg-surface-2 transition-all gap-2 h-10 cursor-pointer"
                        >
                            <Home className="h-4 w-4 text-fg-mute" />
                            Go to Home
                        </Button>
                    </div>

                    {/* Tech details toggle section */}
                    <div className="w-full border-t border-border-soft pt-4 mt-2">
                        <button
                          onClick={() => setShowDetails(!showDetails)}
                          className="flex items-center justify-center gap-1.5 text-xs font-medium text-fg-mute hover:text-fg transition-colors w-full py-1 cursor-pointer"
                        >
                            <span>{showDetails ? 'Hide' : 'Show'} technical details</span>
                            {showDetails ? (
                                <ChevronUp className="h-3.5 w-3.5" />
                            ) : (
                                <ChevronDown className="h-3.5 w-3.5" />
                            )}
                        </button>

                        <AnimatePresence initial={false}>
                            {showDetails && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                    animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                                    className="overflow-hidden text-left"
                                >
                                    <div className="relative">
                                        <button
                                            onClick={handleCopy}
                                            className="absolute right-2.5 top-2.5 rounded-md p-1.5 bg-surface border border-border-soft text-fg-mute hover:text-fg hover:bg-surface-2 transition-all cursor-pointer"
                                            title="Copy stack trace"
                                        >
                                            {copied ? (
                                                <Check className="h-3.5 w-3.5 text-pos" />
                                            ) : (
                                                <Copy className="h-3.5 w-3.5" />
                                            )}
                                        </button>
                                        <pre className="max-h-48 w-full overflow-auto rounded-lg bg-bg-deep border border-border-soft p-4 pr-12 font-mono text-[11px] leading-relaxed text-fg-dim select-text">
                                            {errorString}
                                        </pre>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}