
import * as React from "react";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  label: string;
  placeholder?: string;
  disabledDates?: Date[];
  className?: string;
  selectedForRange?: boolean;
  isSelecting?: boolean;
  minDate?: Date;
  autoOpen?: boolean;
  onDayMouseEnter?: (day: Date) => void;
  onDayMouseLeave?: () => void;
}

export function DatePicker({
  date,
  setDate,
  label,
  placeholder = "Vyberte datum",
  disabledDates = [],
  className,
  selectedForRange = false,
  isSelecting = true,
  minDate,
  autoOpen = true,
  onDayMouseEnter,
  onDayMouseLeave,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Function to handle calendar state changes
  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setOpen(false);
    }
  };

  // When isSelecting changes to true, open the popover if autoOpen is true
  React.useEffect(() => {
    if (isSelecting && !open && autoOpen) {
      setOpen(true);
    }
  }, [isSelecting, open, autoOpen]);

  const isDateDisabled = (date: Date) => {
    return disabledDates.some(
      (disabledDate) =>
        disabledDate.getDate() === date.getDate() &&
        disabledDate.getMonth() === date.getMonth() &&
        disabledDate.getFullYear() === date.getFullYear()
    );
  };

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
              selectedForRange && "border-forest-600 border-2",
              isSelecting && "ring-2 ring-forest-400 ring-offset-2",
              "h-12"
            )}
          >
            {date ? (
              format(date, "P", { locale: cs })
            ) : (
              <span>{placeholder}</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-2 text-center text-sm font-medium">
            {label}
          </div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            disabled={isDateDisabled}
            locale={cs}
            numberOfMonths={2}
            showOutsideDays={false}
            className="pointer-events-auto border-t"
            fromDate={minDate}
            onDayMouseEnter={onDayMouseEnter}
            onDayMouseLeave={onDayMouseLeave}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
