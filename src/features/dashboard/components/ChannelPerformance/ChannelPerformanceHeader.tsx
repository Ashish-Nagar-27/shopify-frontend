import type { FC } from "react"
import { PERF_SERIES } from "./constants"


export const ChannelPerformanceHeader: FC = () => {

    return <div className="flex items-center justify-between border-b border-border-soft px-[20px] py-[16px]">
        <h3 className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-fg-mute">
            Channel Performance · <span className="text-cyan">Revenue</span>
        </h3>
        <div className="flex flex-wrap gap-[18px]">
            {PERF_SERIES.map((s) => (
                <span key={s.key} className="inline-flex items-center gap-[8px] text-[12px] text-fg-dim">
                    <span
                        className="h-[10px] w-[10px] rounded-full"
                        style={{ background: s.stroke, boxShadow: `0 0 10px ${s.stroke}` }}
                    />
                    {s.label}
                </span>
            ))}
        </div>
    </div>
}