
import { useState, useEffect } from "react";
import { startOfDay, isAfter, isBefore, isEqual, addDays, format } from "date-fns";
import { DateRange } from "@/components/DateRangePicker";
import { isDateReserved, hasReservationsInRange } from "../utils/dateUtils";

interface DateRangeSelectionProps {
  value: DateRange;
  onChange: (value: DateRange) => void;
  disabledDates?: Date[];
  minDays?: number;
}

export const useDateRangeSelection = ({
  value,
  onChange,
  disabledDates = [],
  minDays = 2
}: DateRangeSelectionProps) => {
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
          // Normalize dates by removing the time component and use a consistent format
          const normalizedDate = startOfDay(new Date(date));
          const dateKey = format(normalizedDate, 'yyyy-MM-dd');
          map.set(dateKey, true);
          console.log(`Disabled date added to map: ${dateKey} (${normalizedDate.getDate()}/${normalizedDate.getMonth() + 1})`);
        }
      });
    }
    
    setDisabledDatesMap(map);
    console.log(`Processed ${map.size} disabled dates`);
  }, [disabledDates]);
  
  // Sync component state with external value
  useEffect(() => {
    setArrivalDate(value.from);
    setDepartureDate(value.to);
  }, [value.from, value.to]);
  
  // Handle mouse enter on a day
  const onDayMouseEnter = (date: Date) => {
    if (!arrivalDate || departureDate) return;
    setHoverDate(date);
  };
  
  // Handle mouse leave on a day
  const onDayMouseLeave = () => {
    setHoverDate(undefined);
  };
  
  // Check if a date is reserved
  const isFullyReserved = (date: Date) => {
    return isDateReserved(date, disabledDatesMap);
  };
  
  // Determine if a date should be disabled
  const isDateDisabled = (date: Date) => {
    // Don't allow selection of past dates
    if (isBefore(date, today)) return true;
    
    // Don't allow selection of fully reserved dates
    if (isFullyReserved(date)) {
      return true;
    }
    
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
      return hasReservationsInRange(arrivalDate, dateToCheck, disabledDatesMap);
    }
    
    return false;
  };
  
  // Handle day click
  const onDayClick = (date: Date) => {
    // Log the clicked date for debugging purposes
    console.log(`Day clicked: ${format(date, 'yyyy-MM-dd')} (${date.getDate()}/${date.getMonth() + 1})`);
    
    if (isFullyReserved(date)) {
      console.log(`Cannot select reserved date: ${date}`);
      return;
    }
    
    if (!arrivalDate) {
      const selectedArrivalDate = startOfDay(date);
      console.log(`Setting arrival date: ${format(selectedArrivalDate, 'yyyy-MM-dd')} (${selectedArrivalDate.getDate()}/${selectedArrivalDate.getMonth() + 1})`);
      setArrivalDate(selectedArrivalDate);
      onChange({ from: selectedArrivalDate, to: undefined });
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
        const selectedArrivalDate = startOfDay(date);
        console.log(`Updating arrival date: ${format(selectedArrivalDate, 'yyyy-MM-dd')} (${selectedArrivalDate.getDate()}/${selectedArrivalDate.getMonth() + 1})`);
        setArrivalDate(selectedArrivalDate);
        onChange({ from: selectedArrivalDate, to: undefined });
        return;
      }
      
      // Ensure min stay and no reserved dates in between
      const minDepartureDate = addDays(arrivalDate, minDays - 1);
      if (isBefore(date, minDepartureDate)) {
        console.log(`Selected departure date doesn't meet minimum stay of ${minDays} days`);
        return;
      }
      
      // Check for reserved dates between arrival and departure
      if (hasReservationsInRange(arrivalDate, date, disabledDatesMap)) {
        console.log("Cannot select this range because there are reserved dates in between");
        return;
      }
      
      const selectedDepartureDate = startOfDay(date);
      console.log(`Setting departure date: ${format(selectedDepartureDate, 'yyyy-MM-dd')} (${selectedDepartureDate.getDate()}/${selectedDepartureDate.getMonth() + 1})`);
      setDepartureDate(selectedDepartureDate);
      onChange({ from: arrivalDate, to: selectedDepartureDate });
      return;
    }
    
    // Reset if both dates were already selected
    const selectedArrivalDate = startOfDay(date);
    console.log(`Resetting selection with new arrival date: ${format(selectedArrivalDate, 'yyyy-MM-dd')} (${selectedArrivalDate.getDate()}/${selectedArrivalDate.getMonth() + 1})`);
    setArrivalDate(selectedArrivalDate);
    setDepartureDate(undefined);
    onChange({ from: selectedArrivalDate, to: undefined });
  };
  
  // Prepare modifiers for react-day-picker
  const getModifiers = () => ({
    hoverRange: !departureDate && arrivalDate && hoverDate ? 
      { from: arrivalDate, to: hoverDate } : undefined,
    selectedRange: arrivalDate && departureDate ? 
      { from: arrivalDate, to: departureDate } : undefined,
    arrivalDate: arrivalDate,
    departureDate: departureDate,
    fullyReserved: disabledDates
  });
  
  // Make sure to not disable the arrival date when it's already selected
  const getDisabledDaysFunc = (date: Date) => {
    // Special case: Don't disable the arrival date if it's selected
    if (arrivalDate && isEqual(date, arrivalDate)) {
      return false;
    }
    return isDateDisabled(date);
  };
  
  return {
    arrivalDate,
    departureDate,
    hoverDate,
    onDayMouseEnter,
    onDayMouseLeave,
    onDayClick,
    getModifiers,
    getDisabledDaysFunc
  };
};
