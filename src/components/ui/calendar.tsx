import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, DayMouseEventHandler } from "react-day-picker";
import { cs } from "date-fns/locale";

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
  modifiers,
  modifiersClassNames,
  ...props
}: CalendarProps) {
  // Debug what modifiers we're getting
  React.useEffect(() => {
    console.log("Calendar component received modifiers:", modifiers);
    console.log("Calendar component received modifiersClassNames:", modifiersClassNames);
  }, [modifiers, modifiersClassNames]);

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 pointer-events-auto w-full bg-white", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full justify-center",
        month: "space-y-4 w-full",
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
        cell: "h-9 w-9 text-center text-sm p-0 relative bg-white rounded-md overflow-hidden",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md"
        ),
        day_selected:
          "bg-forest-600 text-white hover:bg-forest-700 hover:text-white focus:bg-forest-700 focus:text-white rounded-md",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "day-selectedRange",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      onDayMouseEnter={onDayMouseEnter}
      onDayMouseLeave={onDayMouseLeave}
      modifiers={modifiers}
      modifiersClassNames={{
        hoverRange: "day-hoverRange",
        selectedRange: "day-selectedRange",
        arrivalSelected: "day-arrivalSelected",
        departureSelected: "day-departureSelected",
        arrivalDate: "day-arrivalDate",
        departureDate: "day-departureDate",
        fullyReserved: "day-fullyReserved",
        morningReserved: "day-morningReserved",
        afternoonReserved: "day-afternoonReserved",
        ...modifiersClassNames,
      }}
      modifiersStyles={{
        range_middle: {
          backgroundColor: "rgb(226, 232, 226)", // forest-200
          borderRadius: "0.375rem", // rounded-md
        },
        ...props.modifiersStyles,
      }}
      locale={cs}
      weekStartsOn={1}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
