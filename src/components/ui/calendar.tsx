
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, DayMouseEventHandler } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  onDayMouseEnter?: DayMouseEventHandler;
  onDayMouseLeave?: DayMouseEventHandler;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  onDayMouseEnter,
  onDayMouseLeave,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 pointer-events-auto", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "h-9 w-9 text-center text-sm p-0 relative",
          "[&:has([aria-selected].day-range-end)]:rounded-r-md",
          "[&:has([aria-selected].day-outside)]:bg-accent/50",
          "[&:has([aria-selected])]:bg-accent",
          "first:[&:has([aria-selected])]:rounded-l-md",
          "last:[&:has([aria-selected])]:rounded-r-md",
          "focus-within:relative focus-within:z-20",
          "[&:has(.day-hoverRange)]:bg-forest-50",
          "[&:has(.day-arrivalSelected)]:bg-forest-600 [&:has(.day-arrivalSelected)]:text-white",
          "[&:has(.day-fullyReserved)]:bg-red-200",
          "[&:has(.day-arrivalDate)]:arrival-date",
          "[&:has(.day-departureDate)]:departure-date"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-forest-600 text-white hover:bg-forest-700 hover:text-white focus:bg-forest-700 focus:text-white",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-forest-100 aria-selected:text-forest-900",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
        Day: ({ date, ...props }) => {
          // Fixed: Cast props to a more specific type that includes modifiers
          const dayProps = props as any;
          const isArrivalDate = dayProps.modifiers?.arrivalDate;
          const isDepartureDate = dayProps.modifiers?.departureDate;
          const isFullyReserved = dayProps.modifiers?.fullyReserved;
          
          return (
            <button
              {...props}
              data-arrival={isArrivalDate ? "true" : undefined}
              data-departure={isDepartureDate ? "true" : undefined}
              className={cn(
                "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                dayProps.className,
                isFullyReserved && "day-fullyReserved"
              )}
            >
              {date.getDate()}
            </button>
          );
        }
      }}
      onDayMouseEnter={onDayMouseEnter}
      onDayMouseLeave={onDayMouseLeave}
      modifiersClassNames={{
        hoverRange: "day-hoverRange",
        arrivalSelected: "day-arrivalSelected",
        arrivalDate: "day-arrivalDate",
        departureDate: "day-departureDate",
        fullyReserved: "day-fullyReserved",
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
