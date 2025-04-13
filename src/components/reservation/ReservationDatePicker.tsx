
import DateRangePicker, { DateRange } from '@/components/DateRangePicker';

interface ReservationDatePickerProps {
  dateRange: DateRange;
  onDateChange: (range: DateRange) => void;
  onReservationClick: () => void;
  disabledDates: Date[];
}

const ReservationDatePicker = ({ 
  dateRange, 
  onDateChange, 
  onReservationClick,
  disabledDates
}: ReservationDatePickerProps) => {
  return (
    <div className="mb-12">
      <DateRangePicker 
        dateRange={dateRange}
        onDateChange={onDateChange}
        disabledDates={disabledDates}
        onReservationClick={onReservationClick}
      />
    </div>
  );
};

export default ReservationDatePicker;
