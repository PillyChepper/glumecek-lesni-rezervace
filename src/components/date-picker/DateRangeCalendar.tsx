
import { Calendar } from "@/components/ui/calendar";
import { isSameDay, isAfter, isBefore, isWithinInterval, startOfDay } from "date-fns";
import { useMemo, useEffect } from "react";
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
        const dateStr = date.toDateString();
        // Mark both morning and afternoon as reserved for simplicity
        map.set(dateStr, { 
          morning: true, 
          afternoon: true 
        });
      });
    }
    
    return map;
  }, [disabledDates]);

  // Debug information for the component
  useEffect(() => {
    console.log("DateRangeCalendar render. Selected date:", selectedDate);
    console.log("Arrival date:", arrivalDate);
    console.log("Departure date:", departureDate);
    console.log("Is selecting departure:", isSelectingDeparture);
    console.log("Hover date:", hoverDate);
    
    if (disabledDates?.length > 0) {
      console.log("Disabled dates count:", disabledDates.length);
    }
  }, [selectedDate, arrivalDate, departureDate, isSelectingDeparture, hoverDate, disabledDates]);

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
    if (!arrivalDate) return false;
    return isSameDay(day, arrivalDate);
  };

  const isDepartureDate = (day: Date) => {
    if (!departureDate) return false;
    return isSameDay(day, departureDate);
  };
  
  const isReservedDate = (day: Date) => {
    return disabledDates.some(disabledDate => isSameDay(day, disabledDate));
  };
  
  // Modifiers object with proper highlighting functions
  const modifiers = useMemo(() => {
    const mods = {
      hoverRange: (day: Date) => isInHoverRange(day) && !isArrivalDate(day) && !isDepartureDate(day),
      selectedRange: (day: Date) => isInRange(day) && !isArrivalDate(day) && !isDepartureDate(day),
      arrivalSelected: (day: Date) => isArrivalDate(day),
      departureSelected: (day: Date) => isDepartureDate(day),
      fullyReserved: (day: Date) => isReservedDate(day),
      morningReserved: (day: Date) => {
        const restrictions = disabledDatesMap.get(day.toDateString());
        return restrictions?.morning && !restrictions?.afternoon;
      },
      afternoonReserved: (day: Date) => {
        const restrictions = disabledDatesMap.get(day.toDateString());
        return !restrictions?.morning && restrictions?.afternoon;
      }
    };
    
    // Debug check for specific dates
    if (arrivalDate) {
      console.log(`Arrival date (${arrivalDate.toDateString()}) modifier check:`, mods.arrivalSelected(arrivalDate));
    }
    if (departureDate) {
      console.log(`Departure date (${departureDate.toDateString()}) modifier check:`, mods.departureSelected(departureDate));
    }
    
    return mods;
  }, [arrivalDate, departureDate, hoverDate, disabledDatesMap, disabledDates]);

  // Provide explicit CSS class mapping for each modifier
  const modifiersClassNames = {
    hoverRange: "day-hoverRange",
    selectedRange: "day-selectedRange",
    arrivalSelected: "day-arrivalSelected",
    departureSelected: "day-departureSelected",
    fullyReserved: "day-fullyReserved",
    morningReserved: "day-morningReserved",
    afternoonReserved: "day-afternoonReserved"
  };

  return (
    <div className="p-0 w-full">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onSelect}
        className="border-0 w-full"
        modifiers={modifiers}
        modifiersClassNames={modifiersClassNames}
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
