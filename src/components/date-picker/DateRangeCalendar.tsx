
import { Calendar } from "@/components/ui/calendar";
import { cs } from "date-fns/locale";
import { compareAsc, isSameDay } from "date-fns";

interface DateRangeCalendarProps {
  selectedDate: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  onDayMouseEnter: (day: Date) => void;
  onDayMouseLeave: () => void;
  isSelectingDeparture: boolean;
  arrivalDate: Date | undefined;
  disabledDates: Date[];
  hoverDate?: Date;
}

// Helper type to track reservation periods
interface ReservationPeriod {
  from: Date;
  to: Date;
}

const DateRangeCalendar = ({
  selectedDate,
  onSelect,
  onDayMouseEnter,
  onDayMouseLeave,
  isSelectingDeparture,
  arrivalDate,
  disabledDates,
  hoverDate,
}: DateRangeCalendarProps) => {
  // Function to check if a date is in the hover range
  const isDateInHoverRange = (date: Date) => {
    if (isSelectingDeparture && arrivalDate && hoverDate && date >= arrivalDate && date <= hoverDate) {
      return true;
    }
    return false;
  };
  
  // Convert disabledDates to reservation periods for better visualization
  const getReservationPeriods = (): ReservationPeriod[] => {
    if (!disabledDates || disabledDates.length === 0) return [];
    
    // Sort dates in chronological order
    const sortedDates = [...disabledDates].sort(compareAsc);
    const periods: ReservationPeriod[] = [];
    
    let currentPeriod: ReservationPeriod | null = null;
    
    sortedDates.forEach((date, index) => {
      if (!currentPeriod) {
        // Start a new period
        currentPeriod = { from: date, to: date };
      } else {
        // Check if this date is consecutive with the current period
        const prevDate = new Date(date);
        prevDate.setDate(prevDate.getDate() - 1);
        
        if (isSameDay(prevDate, sortedDates[index - 1])) {
          // Extend current period
          currentPeriod.to = date;
        } else {
          // End current period and start a new one
          periods.push(currentPeriod);
          currentPeriod = { from: date, to: date };
        }
      }
    });
    
    // Add the last period if exists
    if (currentPeriod) {
      periods.push(currentPeriod);
    }
    
    return periods;
  };
  
  // Check if a date is an arrival date in any reservation period
  const isArrivalDate = (date: Date): boolean => {
    const periods = getReservationPeriods();
    return periods.some(period => isSameDay(period.from, date));
  };
  
  // Check if a date is a departure date in any reservation period
  const isDepartureDate = (date: Date): boolean => {
    const periods = getReservationPeriods();
    return periods.some(period => isSameDay(period.to, date));
  };
  
  // Check if a date is fully reserved (middle of a reservation)
  const isFullyReserved = (date: Date): boolean => {
    const periods = getReservationPeriods();
    return periods.some(period => 
      date > period.from && date < period.to && 
      !isSameDay(period.from, date) && 
      !isSameDay(period.to, date)
    );
  };

  // For debugging
  console.log("Disabled dates:", disabledDates);
  console.log("Reservation periods:", getReservationPeriods());
  console.log("Selected date:", selectedDate);
  console.log("Is selecting departure:", isSelectingDeparture);

  return (
    <>
      <div className="p-2 text-center text-sm font-medium">
        {isSelectingDeparture ? "Vyberte den odjezdu" : "Vyberte den příjezdu"}
      </div>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onSelect}
        onDayMouseEnter={onDayMouseEnter}
        onDayMouseLeave={onDayMouseLeave}
        modifiers={{
          hoverRange: (date) => isDateInHoverRange(date),
          arrivalSelected: (date) => 
            arrivalDate !== undefined && 
            date.getTime() === arrivalDate.getTime(),
          arrivalDate: (date) => isArrivalDate(date),
          departureDate: (date) => isDepartureDate(date),
          fullyReserved: (date) => isFullyReserved(date),
        }}
        disabled={(date) => {
          // Only disable dates that are in the middle of a reservation
          // NOT arrival or departure dates (which should be selectable for new bookings)
          if (isFullyReserved(date)) {
            return true;
          }
          
          // When selecting departure date, disable dates before arrival date
          if (isSelectingDeparture && arrivalDate) {
            return date < arrivalDate;
          }
          
          return false;
        }}
        locale={cs}
        numberOfMonths={2}
        showOutsideDays={false}
        fromMonth={new Date()} // Don't allow selecting dates from the past
        className="pointer-events-auto border-t"
      />
    </>
  );
};

export default DateRangeCalendar;
