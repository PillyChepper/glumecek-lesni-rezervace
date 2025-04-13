import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import DatePickerInput from "./date-picker/DatePickerInput";
import DateRangeCalendar from "./date-picker/DateRangeCalendar";

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
      if (date?.getTime() === dateRange.from?.getTime()) {
        // Clicking the same date again, unselect it
        onDateChange({
          from: undefined,
          to: undefined,
        });
      } else {
        // Selecting a new arrival date
        onDateChange({
          from: date,
          to: undefined,
        });
        if (date) {
          setSelectingDeparture(true);
        }
      }
    } else {
      // Selecting departure date
      if (date && dateRange.from) {
        if (date < dateRange.from) {
          // If user selects a date before arrival, make it the new arrival date
          onDateChange({
            from: date,
            to: undefined,
          });
        } else if (date.getTime() === dateRange.from.getTime()) {
          // If user selects the same date as arrival, unselect arrival
          onDateChange({
            from: undefined,
            to: undefined,
          });
          setSelectingDeparture(false);
        } else {
          // Valid departure date
          onDateChange({
            ...dateRange,
            to: date,
          });
          setOpen(false);
          setSelectingDeparture(false);
          setHoverDate(undefined);
        }
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
      setSelectingDeparture(dateRange.from !== undefined);
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

  // Make sure to reset selectingDeparture if arrival date is removed
  useEffect(() => {
    if (!dateRange.from) {
      setSelectingDeparture(false);
    }
  }, [dateRange.from]);

  return (
    <div className="w-full space-y-6 text-center">
      <h2 className="section-title">
        Přijeďte si k nám odpočinout
      </h2>
      
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-[800px] mx-auto">
        <Popover open={open} onOpenChange={handleOpenChange}>
          <div className="flex flex-col md:flex-row gap-4 flex-1 justify-center items-center w-full">
            <div className="md:w-[300px] w-full">
              <PopoverTrigger asChild>
                <DatePickerInput
                  date={dateRange.from}
                  label="Příjezd"
                  onClick={handleArrivalTriggerClick}
                  isActive={!selectingDeparture && open}
                />
              </PopoverTrigger>
            </div>
            
            <div className="md:w-[300px] w-full">
              <DatePickerInput
                date={dateRange.to}
                label="Odjezd"
                onClick={handleDepartureTriggerClick}
                isActive={selectingDeparture && open}
                disabled={!dateRange.from}
              />
            </div>
            
            <PopoverContent className="w-[620px] p-0" align="start" sideOffset={5}>
              <DateRangeCalendar
                selectedDate={selectingDeparture ? dateRange.to : dateRange.from}
                onSelect={handleDateSelect}
                onDayMouseEnter={handleDayMouseEnter}
                onDayMouseLeave={handleDayMouseLeave}
                isSelectingDeparture={selectingDeparture}
                arrivalDate={dateRange.from}
                disabledDates={disabledDates}
                hoverDate={hoverDate}
              />
            </PopoverContent>
          </div>
        </Popover>
        
        <Button 
          onClick={handleReservationClick}
          className="bg-forest-600 hover:bg-forest-700 h-12 md:w-[180px] w-full"
          disabled={!dateRange.from || !dateRange.to}
        >
          REZERVOVAT
        </Button>
      </div>
    </div>
  );
};

export default DateRangePicker;
