
import DateRangePicker, { DateRange } from '@/components/DateRangePicker';
import { memo } from 'react';

interface ReservationDatePickerProps {
  dateRange: DateRange;
  onDateChange: (range: DateRange) => void;
  onReservationClick: () => void;
  disabledDates: Date[];
}

const ReservationDatePicker = memo(({ 
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
});

ReservationDatePicker.displayName = 'ReservationDatePicker';

export default ReservationDatePicker;
