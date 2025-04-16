
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
    const map = new Map<string, { morning: boolean; afternoon: boolean }>();
    
    if (disabledDates && disabledDates.length > 0) {
      disabledDates.forEach((date) => {
        const existingRestrictions = map.get(date.toDateString()) || { morning: false, afternoon: false };
        map.set(date.toDateString(), { 
          morning: true, 
          afternoon: true 
        });
      });
    }
    
    return map;
  }, [disabledDates]);

  const getNextDisabledDate = (fromDate: Date) => {
    return disabledDates
      .filter(date => isAfter(date, fromDate))
      .sort((a, b) => a.getTime() - b.getTime())[0];
  };

  const isDateDisabled = (date: Date) => {
    const currentDate = startOfDay(date);
    const dateStr = currentDate.toDateString();
    const restrictions = disabledDatesMap.get(dateStr);

    if (isSelectingDeparture && arrivalDate) {
      if (isBefore(currentDate, arrivalDate)) {
        return true;
      }

      if (isSameDay(currentDate, arrivalDate)) {
        return false;
      }

      if (restrictions?.morning) {
        return true;
      }
    } else {
      if (restrictions?.afternoon) {
        return true;
      }
    }

    return false;
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
      fullyReserved: (day: Date) => {
        const restrictions = disabledDatesMap.get(day.toDateString());
        return restrictions?.morning && restrictions?.afternoon;
      },
      morningReserved: (day: Date) => {
        const restrictions = disabledDatesMap.get(day.toDateString());
        return restrictions?.morning && !restrictions?.afternoon;
      },
      afternoonReserved: (day: Date) => {
        const restrictions = disabledDatesMap.get(day.toDateString());
        return !restrictions?.morning && restrictions?.afternoon;
      }
    };
  }, [arrivalDate, departureDate, hoverDate, disabledDatesMap]);

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
        disabled={isDateDisabled}
        locale={cs}
        weekStartsOn={1}
      />
    </div>
  );
};

export default DateRangeCalendar;
