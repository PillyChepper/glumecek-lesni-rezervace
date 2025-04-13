
import { Calendar } from "@/components/ui/calendar";
import { isSameDay, isAfter, isBefore, isWithinInterval } from "date-fns";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import React from "react";
import { cs } from "date-fns/locale";

interface DateRangeCalendarProps {
  selectedDate?: Date;
  onSelect: (date: Date | undefined) => void;
  arrivalDate?: Date;
  isSelectingDeparture?: boolean;
  disabledDates?: Date[];
  onDayMouseEnter?: (day: Date) => void;
  onDayMouseLeave?: () => void;
  hoverDate?: Date;
}

const DateRangeCalendar = ({
  selectedDate,
  onSelect,
  arrivalDate,
  isSelectingDeparture = false,
  disabledDates = [],
  onDayMouseEnter,
  onDayMouseLeave,
  hoverDate,
}: DateRangeCalendarProps) => {
  // Create a map of disabled dates for faster lookup
  const disabledDatesMap = useMemo(() => {
    const map = new Map<string, boolean>();
    
    if (disabledDates && disabledDates.length > 0) {
      disabledDates.forEach((date) => {
        if (date) {
          map.set(date.toDateString(), true);
        }
      });
    }
    
    return map;
  }, [disabledDates]);
  
  // Function to check if a date is disabled
  const isDateDisabled = (date: Date) => {
    return disabledDatesMap.has(date.toDateString());
  };
  
  // Function to determine if a day is in the hovered range
  const isInHoverRange = (day: Date) => {
    if (isSelectingDeparture && arrivalDate && hoverDate && !isDateDisabled(day)) {
      if (isAfter(hoverDate, arrivalDate)) {
        // Hover date is after arrival date (normal forward selection)
        return isWithinInterval(day, { start: arrivalDate, end: hoverDate });
      } else if (isBefore(hoverDate, arrivalDate)) {
        // Hover date is before arrival date (backward selection)
        return isWithinInterval(day, { start: hoverDate, end: arrivalDate });
      }
    }
    return false;
  };
  
  // Function to check if a date is the arrival date
  const isArrivalDate = (day: Date) => {
    return arrivalDate ? isSameDay(day, arrivalDate) : false;
  };
  
  // Set modifiers for the days
  const modifiers = useMemo(() => {
    return {
      // Always apply arrivalSelected to the arrival date, regardless of hover state
      hoverRange: (day: Date) => isInHoverRange(day) && !isArrivalDate(day),
      arrivalSelected: (day: Date) => isArrivalDate(day),
      fullyReserved: (day: Date) => isDateDisabled(day),
      arrivalDate: (day: Date) => isArrivalDate(day),
      departureDate: (day: Date) => selectedDate && isSameDay(day, selectedDate),
    };
  }, [arrivalDate, selectedDate, hoverDate, disabledDatesMap]);

  // Custom styles for the calendar
  const calendarStyles = {
    // Apply custom styles with React CSS object syntax instead of string literals
    ".arrival-date": {
      position: "relative",
    },
    ".arrival-date::after": {
      content: '""',
      position: "absolute",
      right: 0,
      width: "50%",
      height: "100%",
      backgroundColor: "rgb(240, 253, 244)",
      zIndex: -1,
    },
    ".departure-date": {
      position: "relative",
    },
    ".departure-date::before": {
      content: '""',
      position: "absolute",
      left: 0,
      width: "50%",
      height: "100%",
      backgroundColor: "rgb(240, 253, 244)",
      zIndex: -1,
    },
  };

  return (
    <div className="p-0" style={calendarStyles as React.CSSProperties}>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onSelect}
        className="border-0"
        modifiers={modifiers}
        onDayMouseEnter={onDayMouseEnter}
        onDayMouseLeave={onDayMouseLeave}
        numberOfMonths={2}
        showOutsideDays={false}
        disabled={isDateDisabled}
        locale={cs}
        weekStartsOn={1}
      />
    </div>
  );
};

export default DateRangeCalendar;
