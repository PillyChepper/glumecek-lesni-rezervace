
import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { startOfDay, isAfter, isBefore, isEqual, addDays } from "date-fns";
import { cs } from "date-fns/locale";
import { DateRange } from "@/components/DateRangePicker";

interface DateRangeCalendarProps {
  value: DateRange;
  onChange: (value: DateRange) => void;
  disabledDates?: Date[];
  minDays?: number;
}

const DateRangeCalendar = ({
  value,
  onChange,
  disabledDates = [],
  minDays = 2,
}: DateRangeCalendarProps) => {
  const today = startOfDay(new Date());
  const [arrivalDate, setArrivalDate] = useState<Date | undefined>(value.from);
  const [departureDate, setDepartureDate] = useState<Date | undefined>(value.to);
  const [hoverDate, setHoverDate] = useState<Date | undefined>(undefined);
  const [disabledDatesMap, setDisabledDatesMap] = useState<Map<string, boolean>>(
    new Map()
  );

  // Process disabled dates into a Map for faster lookups
  useEffect(() => {
    const map = new Map<string, boolean>();
    
    if (disabledDates && disabledDates.length > 0) {
      console.log('Processing disabled dates:', disabledDates);
      disabledDates.forEach((date) => {
        if (date) {
          // Normalize dates by removing the time component
          const normalizedDate = startOfDay(new Date(date));
          map.set(normalizedDate.toISOString(), true);
          console.log(`Disabled date added to map: ${normalizedDate.toISOString()}`);
        }
      });
    }
    
    setDisabledDatesMap(map);
    console.log(`Processed ${map.size} disabled dates`);
  }, [disabledDates]);
  
  const onDayMouseEnter = (date: Date) => {
    if (!arrivalDate || departureDate) return;
    setHoverDate(date);
  };
  
  const isFullyReserved = (date: Date) => {
    const normalizedDate = startOfDay(new Date(date)).toISOString();
    const isReserved = disabledDatesMap.has(normalizedDate);
    if (isReserved) {
      console.log(`Date ${normalizedDate} is marked as fully reserved`);
    }
    return isReserved;
  };
  
  const isDateDisabled = (date: Date) => {
    // Don't allow selection of past dates
    if (isBefore(date, today)) return true;
    
    // Don't allow selection of fully reserved dates
    if (isFullyReserved(date)) return true;
    
    // If arrival date is set, find the range of selectable departure dates
    if (arrivalDate && !departureDate) {
      // Can't select dates before arrival
      if (isBefore(date, arrivalDate)) return false; // Allow clicking on arrival date
      
      // Check if any date in between arrival and the hovered date is reserved
      const dateToCheck = hoverDate && isAfter(hoverDate, arrivalDate) ? hoverDate : date;
      
      // The minimum departure date based on minDays
      const minDepartureDate = addDays(arrivalDate, minDays - 1);
      
      // Ensure minimum stay
      if (isBefore(date, minDepartureDate) && !isEqual(date, arrivalDate)) {
        return true;
      }
      
      // Check all dates between arrival and departure for reservations
      let currentDate = addDays(arrivalDate, 1);
      while (isBefore(currentDate, dateToCheck) || isEqual(currentDate, dateToCheck)) {
        if (isFullyReserved(currentDate)) {
          return true;
        }
        currentDate = addDays(currentDate, 1);
      }
    }
    
    return false;
  };

  const onDayClick = (date: Date) => {
    if (isFullyReserved(date)) {
      console.log(`Cannot select reserved date: ${date}`);
      return;
    }
    
    if (!arrivalDate) {
      setArrivalDate(date);
      onChange({ from: date, to: undefined });
      return;
    }
    
    // If clicking the same date as arrival, unselect it
    if (arrivalDate && isEqual(date, arrivalDate)) {
      setArrivalDate(undefined);
      setDepartureDate(undefined);
      onChange({ from: undefined, to: undefined });
      return;
    }
    
    if (!departureDate) {
      if (isBefore(date, arrivalDate)) {
        // If clicked date is before arrival, make it the new arrival
        setArrivalDate(date);
        onChange({ from: date, to: undefined });
        return;
      }
      
      // Ensure min stay and no reserved dates in between
      const minDepartureDate = addDays(arrivalDate, minDays - 1);
      if (isBefore(date, minDepartureDate)) {
        console.log(`Selected departure date doesn't meet minimum stay of ${minDays} days`);
        return;
      }
      
      // Check for reserved dates between arrival and departure
      let hasReservedDates = false;
      let currentDate = addDays(arrivalDate, 1);
      while (isBefore(currentDate, date)) {
        if (isFullyReserved(currentDate)) {
          hasReservedDates = true;
          break;
        }
        currentDate = addDays(currentDate, 1);
      }
      
      if (hasReservedDates) {
        console.log("Cannot select this range because there are reserved dates in between");
        return;
      }
      
      setDepartureDate(date);
      onChange({ from: arrivalDate, to: date });
      return;
    }
    
    // Reset if both dates were already selected
    setArrivalDate(date);
    setDepartureDate(undefined);
    onChange({ from: date, to: undefined });
  };

  const onDayMouseLeave = () => {
    setHoverDate(undefined);
  };
  
  useEffect(() => {
    setArrivalDate(value.from);
    setDepartureDate(value.to);
  }, [value.from, value.to]);
  
  // Fix the modifiers object to use correct types for React Day Picker
  const modifiers = {
    hoverRange: !departureDate && arrivalDate && hoverDate ? 
      { from: arrivalDate, to: hoverDate } : undefined,
    selectedRange: arrivalDate && departureDate ? 
      { from: arrivalDate, to: departureDate } : undefined,
    arrivalDate: arrivalDate,
    departureDate: departureDate,
    fullyReserved: disabledDates
  };

  // Make sure to not disable the arrival date when it's already selected
  const disabledDaysFunc = (date: Date) => {
    // Special case: Don't disable the arrival date if it's selected
    if (arrivalDate && isEqual(date, arrivalDate)) {
      return false;
    }
    return isDateDisabled(date);
  };

  console.log('Number of disabled dates in calendar:', disabledDates.length);

  return (
    <div className="p-0 w-full">
      <Calendar
        mode="range"
        selected={{
          from: arrivalDate,
          to: departureDate,
        }}
        onDayClick={onDayClick}
        onDayMouseEnter={onDayMouseEnter}
        onDayMouseLeave={onDayMouseLeave}
        numberOfMonths={2}
        showOutsideDays={false}
        disabled={disabledDaysFunc}
        modifiers={modifiers}
        locale={cs}
        weekStartsOn={1}
      />
    </div>
  );
};

export default DateRangeCalendar;
