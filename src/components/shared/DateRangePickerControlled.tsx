

import * as React from "react"
import { format, parse, isValid } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import type { DateRange, Matcher } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerControlledProps {
    startDate: string | undefined
    endDate: string | undefined
    onApply: (startDate: string | undefined, endDate: string | undefined) => void
    disabled?: Matcher | Matcher[]
    numberOfMonths?: number
    className?: string
    endMonth?: Date
}

export function DateRangePickerControlled({
    startDate,
    endDate,
    onApply,
    disabled,
    numberOfMonths = 2,
    className,
    endMonth,
}: DateRangePickerControlledProps) {
    const [open, setOpen] = React.useState(false)

    const parsedStart = (() => {
        if (!startDate) return undefined;
        const parsed = parse(startDate, "MMM dd yyyy", new Date());
        return isValid(parsed) ? parsed : undefined;
    })();

    const parsedEnd = (() => {
        if (!endDate) return undefined;
        const parsed = parse(endDate, "MMM dd yyyy", new Date());
        return isValid(parsed) ? parsed : undefined;
    })();

    // draft state — only lives while popover is open
    const [draft, setDraft] = React.useState<DateRange | undefined>(undefined)

    // track if user has started selecting (touched the calendar)
    const [isDirty, setIsDirty] = React.useState(false)

    // when popover opens, initialize draft from committed props
    const handleOpenChange = (nextOpen: boolean) => {
        if (nextOpen) {
            // opening — seed draft with current committed values
            setDraft(
                parsedStart || parsedEnd
                    ? { from: parsedStart, to: parsedEnd }
                    : undefined
            )
            setIsDirty(false)
        } else {
            // closing via outside click / escape — treat as cancel
            // no-op, just close. committed state stays untouched.
        }
        setOpen(nextOpen)
    }

    const handleSelect = (range: DateRange | undefined) => {
        setDraft(range)
        setIsDirty(true)
    }

    const handleApply = () => {
        const formattedStart = draft?.from ? format(draft.from, "MMM dd yyyy") : undefined;
        const formattedEnd = draft?.to ? format(draft.to, "MMM dd yyyy") : undefined;
        onApply(formattedStart, formattedEnd)
        setOpen(false)
    }

    const handleCancel = () => {
        // discard draft, close
        setDraft(
            parsedStart || parsedEnd
                ? { from: parsedStart, to: parsedEnd }
                : undefined
        )
        setIsDirty(false)
        setOpen(false)
    }

    // what to show on the trigger button — always the COMMITTED state
    const displayText = React.useMemo(() => {
        if (!parsedStart) return null
        if (parsedEnd) {
            return `${format(parsedStart, "LLL dd, y")} - ${format(parsedEnd, "LLL dd, y")}`
        }
        return format(parsedStart, "LLL dd, y")
    }, [parsedStart, parsedEnd])

    // apply is enabled only when user has selected both from & to
    const canApply = isDirty && draft?.from && draft?.to

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover open={open} onOpenChange={handleOpenChange}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        data-empty={!parsedStart}
                        className="w-[300px] justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {displayText ?? <span>Pick a date range</span>}
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="range"
                        defaultMonth={draft?.from}
                        selected={draft}
                        onSelect={handleSelect}
                        numberOfMonths={numberOfMonths}
                        disabled={disabled}
                        endMonth={endMonth}
                    />

                    {/* Apply / Cancel footer */}
                    <div className="flex items-center justify-end gap-2 border-t px-4 py-3">
                        <Button variant="ghost" size="sm" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button size="sm" disabled={!canApply} onClick={handleApply}>
                            Apply
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}