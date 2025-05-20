
import { format, startOfDay, isAfter, isBefore, isEqual, addDays } from "date-fns";

/**
 * Creates a Map of disabled dates for faster lookup
 */
export const createDisabledDatesMap = (disabledDates: Date[] = []): Map<string, boolean> => {
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
  
  console.log(`Processed ${map.size} disabled dates`);
  return map;
};

/**
 * Checks if a date is fully reserved
 */
export const isDateReserved = (date: Date, disabledDatesMap: Map<string, boolean>): boolean => {
  const normalizedDate = startOfDay(new Date(date));
  const dateKey = format(normalizedDate, 'yyyy-MM-dd');
  return disabledDatesMap.has(dateKey);
};

/**
 * Checks if a range of dates has any reservations between them
 */
export const hasReservationsInRange = (
  startDate: Date, 
  endDate: Date, 
  disabledDatesMap: Map<string, boolean>
): boolean => {
  let currentDate = addDays(startDate, 1);
  while (isBefore(currentDate, endDate)) {
    if (isDateReserved(currentDate, disabledDatesMap)) {
      return true;
    }
    currentDate = addDays(currentDate, 1);
  }
  return false;
};
