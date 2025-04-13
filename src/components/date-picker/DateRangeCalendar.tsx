
import { Calendar } from "@/components/ui/calendar";
import { cs } from "date-fns/locale";

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
        }}
        modifiersStyles={{
          hoverRange: { backgroundColor: 'rgba(94, 107, 93, 0.1)' },
          arrivalSelected: { 
            backgroundColor: 'rgb(72, 96, 70)', 
            color: 'white',
            fontWeight: 'bold' 
          },
        }}
        disabled={(date) => {
          // Disable dates that are already reserved
          if (disabledDates.some(
            (disabledDate) =>
              disabledDate.getDate() === date.getDate() &&
              disabledDate.getMonth() === date.getMonth() &&
              disabledDate.getFullYear() === date.getFullYear()
          )) {
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
        className="pointer-events-auto border-t"
      />
    </>
  );
};

export default DateRangeCalendar;
