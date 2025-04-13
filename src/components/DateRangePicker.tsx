
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { cn } from "@/lib/utils";

export type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

interface DateRangePickerProps {
  dateRange: DateRange;
  onDateChange: (range: DateRange) => void;
  disabledDates?: Date[];
  onReservationClick?: () => void;
}

const DateRangePicker = ({
  dateRange,
  onDateChange,
  disabledDates = [],
  onReservationClick,
}: DateRangePickerProps) => {
  const [open, setOpen] = useState(false);
  const [selectingDeparture, setSelectingDeparture] = useState(false);
  const [hoverDate, setHoverDate] = useState<Date | undefined>(undefined);
  
  const handleDateSelect = (date: Date | undefined) => {
    if (!selectingDeparture) {
      // Selecting arrival date
      onDateChange({
        from: date,
        to: undefined,
      });
      setSelectingDeparture(true);
    } else {
      // Selecting departure date
      if (date && dateRange.from && date >= dateRange.from) {
        onDateChange({
          ...dateRange,
          to: date,
        });
        setOpen(false);
        setSelectingDeparture(false);
        setHoverDate(undefined);
      }
    }
  };

  const handleReservationClick = () => {
    if (onReservationClick) {
      onReservationClick();
    }
  };

  const handleArrivalTriggerClick = () => {
    setSelectingDeparture(false);
    setOpen(true);
  };

  const handleDepartureTriggerClick = () => {
    if (dateRange.from) {
      setSelectingDeparture(true);
      setOpen(true);
    }
  };

  // Close the popover when clicking outside
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset selecting state when closing
      setSelectingDeparture(false);
      setHoverDate(undefined);
    }
  };

  // Function to handle mouse over events on calendar days
  const handleDayMouseEnter = (day: Date) => {
    if (selectingDeparture && dateRange.from) {
      setHoverDate(day);
    }
  };

  // Function to handle mouse leave events
  const handleDayMouseLeave = () => {
    setHoverDate(undefined);
  };

  // Function to check if a date is in the hover range
  const isDateInHoverRange = (date: Date) => {
    if (selectingDeparture && dateRange.from && hoverDate && date >= dateRange.from && date <= hoverDate) {
      return true;
    }
    return false;
  };

  return (
    <div className="w-full space-y-6">
      <h2 className="text-xl md:text-2xl font-display font-medium text-forest-800">
        Najděte si své datum návštěvy
      </h2>
      
      <div className="flex flex-col md:flex-row gap-4">
        <Popover open={open} onOpenChange={handleOpenChange}>
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <PopoverTrigger asChild>
              <Button
                onClick={handleArrivalTriggerClick}
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateRange.from && "text-muted-foreground",
                  !selectingDeparture && open && "ring-2 ring-forest-400 ring-offset-2",
                  "h-12"
                )}
              >
                {dateRange.from ? (
                  format(dateRange.from, "P", { locale: cs })
                ) : (
                  <span>Příjezd</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            
            <Button
              variant={"outline"}
              onClick={handleDepartureTriggerClick}
              className={cn(
                "w-full justify-start text-left font-normal",
                !dateRange.to && "text-muted-foreground",
                selectingDeparture && open && "ring-2 ring-forest-400 ring-offset-2",
                "h-12"
              )}
              disabled={!dateRange.from}
            >
              {dateRange.to ? (
                format(dateRange.to, "P", { locale: cs })
              ) : (
                <span>Odjezd</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
            
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-2 text-center text-sm font-medium">
                {selectingDeparture ? "Vyberte den odjezdu" : "Vyberte den příjezdu"}
              </div>
              <Calendar
                mode="single"
                selected={selectingDeparture ? dateRange.to : dateRange.from}
                onSelect={handleDateSelect}
                onDayMouseEnter={handleDayMouseEnter}
                onDayMouseLeave={handleDayMouseLeave}
                modifiers={{
                  hoverRange: (date) => isDateInHoverRange(date),
                }}
                modifiersStyles={{
                  hoverRange: { backgroundColor: 'rgba(94, 107, 93, 0.1)' },
                }}
                disabled={(date) => {
                  // Disable dates that are already reserved
                  if (disabledDates.some(
                    (disabledDate) =>
                      disabledDate.getDate() === date.getDate() &&
                      disabledDate.getMonth() === date.getMonth() &&
                      disabledDate.getFullYear() === date.getFullYear()
                  )) {
                    return true;
                  }
                  
                  // When selecting departure date, disable dates before arrival date
                  if (selectingDeparture && dateRange.from) {
                    return date < dateRange.from;
                  }
                  
                  return false;
                }}
                locale={cs}
                numberOfMonths={2}
                showOutsideDays={false}
                className="pointer-events-auto border-t"
              />
            </PopoverContent>
          </div>
        </Popover>
        
        <Button 
          onClick={handleReservationClick}
          className="bg-forest-600 hover:bg-forest-700 h-12 md:w-[180px]"
          disabled={!dateRange.from || !dateRange.to}
        >
          REZERVOVAT
        </Button>
      </div>
    </div>
  );
};

export default DateRangePicker;
