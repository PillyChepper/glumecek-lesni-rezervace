
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

interface DateRangePickerProps {
  dateRange: DateRange;
  onDateChange: (range: DateRange) => void;
  disabledDates?: Date[];
  onSearch?: () => void;
}

const DateRangePicker = ({
  dateRange,
  onDateChange,
  disabledDates = [],
  onSearch,
}: DateRangePickerProps) => {
  const [selectingDeparture, setSelectingDeparture] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  const handleFromChange = (date: Date | undefined) => {
    // When arrival date is selected, automatically set up for selecting departure
    if (date) {
      setSelectingDeparture(true);
      onDateChange({
        from: date,
        to: undefined,
      });
    } else {
      setSelectingDeparture(false);
      onDateChange({
        from: undefined, 
        to: undefined
      });
    }
  };

  const handleToChange = (date: Date | undefined) => {
    if (date) {
      setSelectingDeparture(false);
    }
    onDateChange({
      ...dateRange,
      to: date,
    });
  };

  const handleReservationClick = () => {
    if (onSearch) {
      onSearch();
    }
  };

  return (
    <div className="w-full space-y-6">
      <h2 className="text-xl md:text-2xl font-display font-medium text-forest-800">
        Najděte si své datum návštěvy
      </h2>
      
      <div className="flex flex-col md:flex-row gap-4">
        <DatePicker
          date={dateRange.from}
          setDate={handleFromChange}
          label="Vyberte den příjezdu"
          placeholder="Příjezd"
          disabledDates={disabledDates}
          className="flex-1"
          selectedForRange={dateRange.from && !selectingDeparture}
          isSelecting={!dateRange.from || !selectingDeparture}
          autoOpen={false}
        />
        
        <DatePicker
          date={dateRange.to}
          setDate={handleToChange}
          label="Vyberte den odjezdu"
          placeholder="Odjezd"
          disabledDates={[
            ...disabledDates,
            // Disable dates before arrival date for departure selection
            ...(dateRange.from 
              ? [
                  ...Array.from(
                    { length: dateRange.from.getDate() },
                    (_, i) => new Date(
                      dateRange.from!.getFullYear(),
                      dateRange.from!.getMonth(),
                      i + 1
                    )
                  )
                ] 
              : [])
          ]}
          className="flex-1"
          selectedForRange={dateRange.to && !selectingDeparture}
          isSelecting={selectingDeparture}
          minDate={dateRange.from}
          autoOpen={selectingDeparture}
        />
        
        <Button 
          onClick={handleReservationClick}
          className="bg-forest-600 hover:bg-forest-700 h-12 md:w-[180px]"
        >
          REZERVOVAT
        </Button>
      </div>
    </div>
  );
};

export default DateRangePicker;
