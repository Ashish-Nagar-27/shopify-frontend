import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/ui/data-table";

export type Campaign = {
    id: string;
    campaign: string;
    status: string;
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
    revenue: number;
};

// Generate some sample data to simulate a large dataset
const generateData = (): Campaign[] => {
    const statuses: Campaign["status"][] = ["Active", "Paused", "Completed"];
    const names = [
        "Summer Sale",
        "Product Launch",
        "Flash Discount",
        "Brand Awareness",
        "Retargeting Ads",
        "Holiday Promo",
        "Black Friday",
        "Cyber Monday",
        "Spring Clearance",
        "New Year Special",
        "Influencer Collab",
        "Welcome Series",
        "Abandoned Cart",
        "Cross-sell Campaign",
        "Upsell Offer",
    ];

    return Array.from({ length: 45 }, (_, i) => ({
        id: `CMP-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        campaign: `${names[i % names.length]} 202${Math.floor(i / names.length) + 4}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        impressions: Math.floor(Math.random() * 500000) + 10000,
        clicks: Math.floor(Math.random() * 20000) + 500,
        conversions: Math.floor(Math.random() * 1000) + 10,
        spend: Math.floor(Math.random() * 5000) + 100,
        revenue: Math.floor(Math.random() * 25000) + 500,
    }));
};

const tableData: Campaign[] = generateData();

const statusStyles: Record<string, string> = {
    Active: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30",
    Paused: "bg-amber-500/15 text-amber-400 ring-amber-500/30",
    Completed: "bg-slate-500/15 text-slate-400 ring-slate-500/30",
};

export const columns: ColumnDef<Campaign>[] = [
    {
        accessorKey: "campaign",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="hover:bg-accent hover:text-accent-foreground -ml-4"
                >
                    Campaign
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="font-medium text-foreground">{row.getValue("campaign")}</div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] uppercase font-medium ring-1 ring-inset ${statusStyles[status]}`}
                >
                    {status}
                </span>
            );
        },
    },
    {
        accessorKey: "impressions",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="hover:bg-accent hover:text-accent-foreground -ml-4"
                >
                    Impressions
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("impressions"));
            return <div className="text-muted-foreground">{amount.toLocaleString()}</div>;
        },
    },
    {
        accessorKey: "clicks",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="hover:bg-accent hover:text-accent-foreground -ml-4"
                >
                    Clicks
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("clicks"));
            return <div className="text-muted-foreground">{amount.toLocaleString()}</div>;
        },
    },
    {
        accessorKey: "conversions",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="hover:bg-accent hover:text-accent-foreground -ml-4"
                >
                    Conversions
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("conversions"));
            return <div className="text-muted-foreground">{amount.toLocaleString()}</div>;
        },
    },
    {
        accessorKey: "spend",
        header: () => <div className="text-right">Spend</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("spend"));
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount);
            return <div className="text-right font-medium text-muted-foreground">{formatted}</div>;
        },
    },
    {
        accessorKey: "revenue",
        header: () => <div className="text-right">Revenue</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("revenue"));
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount);
            return <div className="text-right font-medium text-emerald-400">{formatted}</div>;
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const campaign = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-accent text-muted-foreground hover:text-accent-foreground">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(campaign.id)}
                            className="cursor-pointer"
                        >
                            Copy campaign ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer">View details</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">View performance</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];



export function ReportingTable({ tableData, tableDataLoading, tableDataError }: { tableData: any, tableDataLoading: boolean, tableDataError: Error | null }) {


    // const useReportingTableData = useReportingTableData(apiData);
    const formatedData = React.useMemo(() => {
        if (!tableData?.campaign) return [];

        return tableData.campaign.map((c: any) => ({
            id: c.campaign_id,
            campaign: c.campaign_name,
            status: c.campaign_status,
            spend: c.Spend,
            revenue: c.Revenue,
            conversions: c.Sales,
            clicks: c.Clicks,
            impressions: c.Impression,
        }));
    }, [tableData]);

    console.log('formatedData', formatedData)
    return (
        <Card className="border-border bg-card/60 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-card-foreground">
                    Campaign Performance
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                    Detailed breakdown of individual campaign metrics with advanced filtering and sorting.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <DataTable
                    columns={columns}
                    data={formatedData}
                    searchKey="campaign"
                    searchPlaceholder="Filter campaigns..."
                />
            </CardContent>
        </Card>
    );
}
