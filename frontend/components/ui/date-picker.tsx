"use client";

import { useState, useEffect, useRef } from "react";
import { DayPicker } from "react-day-picker";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value?: string;
  onChange?: (date: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled,
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [above, setAbove] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const selected = value ? parseISO(value) : undefined;
  const now = new Date();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node) &&
        calendarRef.current &&
        !calendarRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggle() {
    if (!open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setAbove(spaceBelow < 340);
    }
    setOpen(!open);
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={toggle}
        className={cn(
          "flex w-full items-center justify-between rounded-lg border border-border bg-muted px-3 py-1.5 text-xs",
          "focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          !selected && "text-muted-foreground"
        )}
      >
        <span className="truncate">
          {selected ? format(selected, "MMM d, yyyy") : placeholder}
        </span>
        <CalendarIcon className="h-4 w-4 shrink-0 opacity-50" />
      </button>

      {open && (
        <div
          ref={calendarRef}
          className={cn(
            "absolute z-50 rounded-xl border border-border bg-popover shadow-lg p-3 transition-opacity duration-150",
            above ? "bottom-full mb-1" : "top-full mt-1"
          )}
        >
          <DayPicker
            mode="single"
            selected={selected}
            captionLayout="dropdown"
            startMonth={new Date(1900, 0)}
            endMonth={new Date(2099, 11)}
            defaultMonth={selected || now}
            onSelect={(day) => {
              if (day) {
                onChange?.(format(day, "yyyy-MM-dd"));
                setOpen(false);
              }
            }}
            showOutsideDays
            fixedWeeks
            classNames={{
              months: "flex flex-col",
              month: "space-y-3",
              month_caption: "flex items-center justify-center h-10",
              caption_label: "hidden",
              nav: "flex items-center justify-between w-full absolute top-0 left-0 right-0 h-10 px-1",
              button_previous: cn(
                "h-8 w-8 flex items-center justify-center rounded-md",
                "hover:bg-muted transition-colors cursor-pointer",
                "text-muted-foreground hover:text-foreground"
              ),
              button_next: cn(
                "h-8 w-8 flex items-center justify-center rounded-md",
                "hover:bg-muted transition-colors cursor-pointer",
                "text-muted-foreground hover:text-foreground"
              ),
              dropdowns: "flex items-center justify-center gap-1 pt-10",
              dropdown: cn(
                "h-8 px-2 rounded-md border border-border bg-muted text-sm",
                "focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none cursor-pointer"
              ),
              months_dropdown: "bg-muted",
              years_dropdown: "bg-muted",
              month_grid: "w-full border-collapse",
              weekdays: "flex",
              weekday: "text-muted-foreground w-9 h-9 font-normal text-xs flex items-center justify-center",
              week: "flex w-full mt-1",
              day: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
              day_button: cn(
                "h-9 w-9 p-0 font-normal rounded-md",
                "hover:bg-primary/10 hover:text-primary",
                "focus:bg-primary/20 focus:text-primary",
                "cursor-pointer transition-colors"
              ),
              selected:
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              today: "font-semibold text-primary",
              outside: "text-muted-foreground/40",
              disabled: "text-muted-foreground/30 cursor-not-allowed",
              range_middle: "bg-primary/10 text-primary",
              hidden: "invisible",
            }}
          />
        </div>
      )}
    </div>
  );
}
