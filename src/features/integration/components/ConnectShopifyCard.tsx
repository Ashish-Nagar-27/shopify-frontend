import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface ConnectShopifyCardProps {
    shopDomain: string;
    onShopDomainChange: (domain: string) => void;
    onConnect: () => void;
    isLoading: boolean;
    error: string | null;
}

export function ConnectShopifyCard({
    shopDomain,
    onShopDomainChange,
    onConnect,
    isLoading,
    error,
}: ConnectShopifyCardProps) {
    return (
        <Card className="group relative overflow-hidden border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:border-green-500/30 hover:bg-white/[0.07] hover:shadow-xl hover:shadow-green-500/5">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <CardHeader className="relative">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#96bf48]/10 ring-1 ring-[#96bf48]/20">
                    <svg
                        viewBox="0 0 24 24"
                        className="h-7 w-7"
                        fill="none"
                    >
                        <path
                            d="M15.34 3.27c-.07-.04-.15-.03-.22.01a.26.26 0 0 0-.11.18l-.33 2.03c-.38-.18-.83-.29-1.3-.29-1.77 0-3.2 2.16-3.2 4.83 0 1.31.42 2.22 1.1 2.79l-1.77 11.3c-.02.1.04.19.13.22h.04c.07 0 .14-.05.16-.12l1.68-10.7c.44.14.93.22 1.46.22 1.77 0 3.21-2.16 3.21-4.83 0-2.08-.76-3.64-1.88-4.36l.41-2.5A.23.23 0 0 0 15.34 3.27z"
                            fill="#96bf48"
                        />
                        <path
                            d="M14.27 5.6c-.02-.12-.12-.2-.23-.2h-.02l-1.01.13c-.25-.76-.7-1.46-1.48-1.46h-.07C11.13 3.63 10.7 3.4 10.2 3.4c-1.63 0-3.24 2.04-3.24 4.46 0 1.63.83 2.53 1.83 2.53.71 0 1.24-.74 1.24-.74l-.16 1.04c-.02.1.04.19.13.22h.04c.07 0 .14-.05.16-.12L14.27 5.6z"
                            fill="#5e8e3e"
                        />
                    </svg>
                </div>
                <CardTitle className="text-lg text-white">Shopify</CardTitle>
                <CardDescription className="text-slate-400">
                    Connect your Shopify store to sync products, orders, and
                    customer data in real-time.
                </CardDescription>
            </CardHeader>
            <CardContent className="relative">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="shop-domain" className="text-sm font-medium text-slate-300">
                            Enter your store domain
                        </label>
                        <div className="relative">
                            <input
                                id="shop-domain"
                                type="text"
                                placeholder="mystore.myshopify.com"
                                value={shopDomain}
                                onChange={(e) => onShopDomainChange(e.target.value)}
                                className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm text-red-400">{error}</p>
                    )}

                    <Button
                        onClick={onConnect}
                        disabled={isLoading}
                        className="w-full bg-[#96bf48] font-medium text-white shadow-lg shadow-[#96bf48]/20 transition-all hover:bg-[#7da83e] hover:shadow-[#96bf48]/30 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Connecting...
                            </span>
                        ) : (
                            <>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="mr-2 h-4 w-4"
                                >
                                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                </svg>
                                Connect with Shopify
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
