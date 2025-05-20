
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "@/components/DateRangePicker";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDateRangeSelection } from "./hooks/useDateRangeSelection";
import { cs } from "date-fns/locale";

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
  const isMobile = useIsMobile();
  
  const {
    onDayClick,
    onDayMouseEnter,
    onDayMouseLeave,
    getModifiers,
    getDisabledDaysFunc
  } = useDateRangeSelection({
    value,
    onChange,
    disabledDates,
    minDays
  });

  return (
    <div className="p-0 w-full overflow-y-auto max-h-[80vh] pb-8">
      <Calendar
        mode="range"
        selected={{
          from: value.from,
          to: value.to,
        }}
        onDayClick={onDayClick}
        onDayMouseEnter={onDayMouseEnter}
        onDayMouseLeave={onDayMouseLeave}
        numberOfMonths={isMobile ? 1 : 2}
        showOutsideDays={false}
        disabled={getDisabledDaysFunc}
        modifiers={getModifiers()}
        locale={cs}
        weekStartsOn={1}
      />
    </div>
  );
};

export default DateRangeCalendar;
