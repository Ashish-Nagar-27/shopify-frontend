import type { FC } from "react";
import { useState } from "react";
import type { ChannelSeries, ChannelOption } from "../../hooks/useChannelPerformanceData";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { SlidersHorizontal, ChevronDown } from "lucide-react";

interface ChannelPerformanceHeaderProps {
    series?: ChannelSeries[];
    allChannels?: ChannelOption[];
    selectedKeys?: string[];
    toggleChannel?: (key: string) => void;
    maxAllowed?: number;
}

export const ChannelPerformanceHeader: FC<ChannelPerformanceHeaderProps> = ({
    series = [],
    allChannels = [],
    selectedKeys = [],
    toggleChannel,
    maxAllowed = 7,
}) => {
    const [search, setSearch] = useState("");

    const filteredChannels = allChannels.filter((ch) =>
        ch.label.toLowerCase().includes(search.toLowerCase())
    );

    const isMaxReached = selectedKeys.length >= maxAllowed;

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-soft px-[20px] py-[14px]">
            <h3 className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-fg-mute">
                Channel Performance · <span className="text-cyan">Revenue</span>
            </h3>

            <div className="flex items-center gap-[16px]">
                {/* Active Channel Legend Badges */}
                <div className="flex flex-wrap items-center gap-[12px]">
                    {series.map((s) => (
                        <span key={s.key} className="inline-flex items-center gap-[6px] text-[12px] text-fg-dim">
                            <span
                                className="h-[8px] w-[8px] rounded-full"
                                style={{ background: s.stroke, boxShadow: `0 0 8px ${s.stroke}` }}
                            />
                            {s.label}
                        </span>
                    ))}
                </div>

                {/* Dropdown Selector if multiple channels exist */}
                {allChannels.length > 0 && toggleChannel && (
                    <Popover>
                        <PopoverTrigger asChild>
                            <button
                                type="button"
                                className="inline-flex items-center gap-[6px] rounded-[8px] border border-border-soft bg-surface-2 px-[10px] py-[6px] text-[12px] font-medium text-fg hover:bg-surface-hi transition-colors cursor-pointer"
                            >
                                <SlidersHorizontal className="h-[13px] w-[13px] text-fg-mute" />
                                <span>Channels ({selectedKeys.length}/{maxAllowed})</span>
                                <ChevronDown className="h-[13px] w-[13px] text-fg-mute" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent
                            align="end"
                            className="w-[230px] p-[10px] bg-surface border border-border-soft shadow-xl rounded-[10px]"
                        >
                            <div className="mb-[8px] flex items-center justify-between px-[4px] pb-[6px] border-b border-border-soft">
                                <span className="text-[12px] font-semibold text-fg">Select Channels</span>
                                <span className="text-[10px] font-mono text-fg-mute">
                                    {selectedKeys.length}/{maxAllowed} max
                                </span>
                            </div>

                            {allChannels.length > 5 && (
                                <div className="mb-[8px]">
                                    <input
                                        type="text"
                                        placeholder="Search channels..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full rounded-[6px] border border-border-soft bg-surface-2 px-[8px] py-[4px] text-[11px] text-fg placeholder:text-fg-mute focus:outline-none focus:border-border"
                                    />
                                </div>
                            )}

                            <div className="max-h-[220px] overflow-y-auto space-y-[2px] pr-[2px]">
                                {filteredChannels.map((ch) => {
                                    const isDisabled = (!ch.isSelected && isMaxReached) || (ch.isSelected && selectedKeys.length <= 1);
                                    return (
                                        <div
                                            key={ch.key}
                                            onClick={() => {
                                                if (!isDisabled) toggleChannel(ch.key);
                                            }}
                                            className={`flex items-center gap-[8px] rounded-[6px] px-[8px] py-[6px] text-[12px] transition-colors cursor-pointer select-none ${
                                                isDisabled ? "opacity-40 cursor-not-allowed" : "hover:bg-surface-2"
                                            }`}
                                        >
                                            <Checkbox
                                                checked={ch.isSelected}
                                                disabled={isDisabled}
                                                onCheckedChange={() => {
                                                    if (!isDisabled) toggleChannel(ch.key);
                                                }}
                                                className="h-[14px] w-[14px]"
                                            />
                                            <span
                                                className="h-[8px] w-[8px] rounded-full shrink-0"
                                                style={{ background: ch.color }}
                                            />
                                            <span className="truncate text-fg text-[12px]">{ch.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </PopoverContent>
                    </Popover>
                )}
            </div>
        </div>
    );
};
