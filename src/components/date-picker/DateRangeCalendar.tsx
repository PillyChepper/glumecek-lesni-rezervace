
import { Calendar } from "@/components/ui/calendar";
import { isSameDay, isAfter, isBefore, isWithinInterval, startOfDay } from "date-fns";
import { useMemo } from "react";
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
  departureDate?: Date;
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
  departureDate,
}: DateRangeCalendarProps) => {
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
  
  const getNextDisabledDate = (fromDate: Date) => {
    return disabledDates
      .filter(date => isAfter(date, fromDate))
      .sort((a, b) => a.getTime() - b.getTime())[0];
  };
  
  const isFullyReserved = (date: Date) => {
    return disabledDatesMap.has(date.toDateString());
  };
  
  const isDateDisabled = (date: Date) => {
    if (isSelectingDeparture && arrivalDate) {
      const startDate = startOfDay(arrivalDate);
      const currentDate = startOfDay(date);
      
      if (isBefore(currentDate, startDate)) {
        return true;
      }
      
      const nextDisabledDate = getNextDisabledDate(startDate);
      if (nextDisabledDate && isAfter(currentDate, nextDisabledDate)) {
        return true;
      }
    }
    
    return isFullyReserved(date);
  };
  
  const isInRange = (day: Date) => {
    if (arrivalDate && departureDate && !isDateDisabled(day)) {
      return isWithinInterval(day, { 
        start: isBefore(arrivalDate, departureDate) ? arrivalDate : departureDate,
        end: isAfter(departureDate, arrivalDate) ? departureDate : arrivalDate
      });
    }
    return false;
  };

  const isInHoverRange = (day: Date) => {
    if (isSelectingDeparture && arrivalDate && hoverDate && !isDateDisabled(day)) {
      if (isAfter(hoverDate, arrivalDate)) {
        return isWithinInterval(day, { start: arrivalDate, end: hoverDate });
      } else if (isBefore(hoverDate, arrivalDate)) {
        return isWithinInterval(day, { start: hoverDate, end: arrivalDate });
      }
    }
    return false;
  };
  
  const isArrivalDate = (day: Date) => {
    return arrivalDate ? isSameDay(day, arrivalDate) : false;
  };

  const isDepartureDate = (day: Date) => {
    return departureDate ? isSameDay(day, departureDate) : false;
  };
  
  const modifiers = useMemo(() => {
    return {
      hoverRange: (day: Date) => isInHoverRange(day) && !isArrivalDate(day) && !isDepartureDate(day),
      selectedRange: (day: Date) => isInRange(day) && !isArrivalDate(day) && !isDepartureDate(day),
      arrivalSelected: (day: Date) => isArrivalDate(day),
      departureSelected: (day: Date) => isDepartureDate(day),
      fullyReserved: (day: Date) => isFullyReserved(day),
    };
  }, [arrivalDate, departureDate, hoverDate, disabledDatesMap]);

  const disabledDatesFunc = (date: Date) => {
    return isDateDisabled(date);
  };

  return (
    <div className="p-0 w-full">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onSelect}
        className="border-0 w-full"
        modifiers={modifiers}
        onDayMouseEnter={onDayMouseEnter}
        onDayMouseLeave={onDayMouseLeave}
        numberOfMonths={2}
        showOutsideDays={false}
        disabled={disabledDatesFunc}
        locale={cs}
        weekStartsOn={1}
      />
    </div>
  );
};

export default DateRangeCalendar;
