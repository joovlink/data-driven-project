"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerProps {
    selected?: Date
    onSelect: (date: Date | undefined) => void
    placeholder?: string
    className?: string
}

export function DatePicker({
    selected,
    onSelect,
    placeholder = "Pick a date",
    className,
}: DatePickerProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    data-empty={!selected}
                    className={cn(
                        "w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground",
                        className
                    )}
                    type="button"
                >
                    <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                    {selected ? format(selected, "PPP") : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={selected}
                    onSelect={(date) => {
                        onSelect(date)
                        if (date) setOpen(false) // auto-close setelah pilih
                    }}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}
