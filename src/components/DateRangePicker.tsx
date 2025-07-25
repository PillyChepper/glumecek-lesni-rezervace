
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import DatePickerInput from "./date-picker/DatePickerInput";
import DateRangeCalendar from "./date-picker/DateRangeCalendar";
import { useIsMobile } from "@/hooks/use-mobile";

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

const DateRangePicker = React.memo(({
  dateRange,
  onDateChange,
  disabledDates = [],
  onReservationClick,
}: DateRangePickerProps) => {
  const [open, setOpen] = useState(false);
  const [selectingDeparture, setSelectingDeparture] = useState(false);
  const [hoverDate, setHoverDate] = useState<Date | undefined>(undefined);
  const isMobile = useIsMobile();
  
  // Memoize the button disabled state
  const isReservationDisabled = useMemo(() => {
    return !dateRange.from || !dateRange.to;
  }, [dateRange.from, dateRange.to]);
  
  const handleDateSelect = useCallback((date: Date | undefined) => {
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
  }, [selectingDeparture, dateRange, onDateChange]);

  const handleReservationClick = useCallback(() => {
    if (onReservationClick) {
      onReservationClick();
    }
  }, [onReservationClick]);

  const handleArrivalTriggerClick = useCallback(() => {
    setSelectingDeparture(false);
    setOpen(true);
  }, []);

  const handleDepartureTriggerClick = useCallback(() => {
    if (dateRange.from) {
      setSelectingDeparture(true);
      setOpen(true);
    }
  }, [dateRange.from]);

  // Close the popover when clicking outside
  const handleOpenChange = useCallback((newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset selecting state when closing
      setSelectingDeparture(dateRange.from !== undefined);
      setHoverDate(undefined);
    }
  }, [dateRange.from]);

  // Function to handle mouse over events on calendar days
  const handleDayMouseEnter = useCallback((day: Date) => {
    if (selectingDeparture && dateRange.from) {
      setHoverDate(day);
    }
  }, [selectingDeparture, dateRange.from]);

  // Function to handle mouse leave events
  const handleDayMouseLeave = useCallback(() => {
    setHoverDate(undefined);
  }, []);

  // Make sure to reset selectingDeparture if arrival date is removed
  useEffect(() => {
    if (!dateRange.from) {
      setSelectingDeparture(false);
    }
  }, [dateRange.from]);

  return (
    <div className="w-full space-y-6 text-center">
      <h2 className="text-lg font-normal text-forest-800">
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
            
            <PopoverContent 
              className="w-[calc(100vw-32px)] md:w-[620px] p-0" 
              align="start" 
              sideOffset={5}
              alignOffset={isMobile ? -50 : 0}
              side={isMobile ? "bottom" : "bottom"}
            >
              <DateRangeCalendar
                value={dateRange}
                onChange={onDateChange}
                disabledDates={disabledDates}
                minDays={2}
              />
            </PopoverContent>
          </div>
        </Popover>
        
        <Button 
          onClick={handleReservationClick}
          className="bg-forest-600 hover:bg-forest-700 h-12 md:w-[180px] w-full text-white"
          disabled={isReservationDisabled}
        >
          REZERVOVAT
        </Button>
      </div>
    </div>
  );
});

DateRangePicker.displayName = 'DateRangePicker';

export default DateRangePicker;
