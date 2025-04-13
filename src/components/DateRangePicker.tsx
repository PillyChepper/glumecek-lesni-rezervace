
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";

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
  const handleFromChange = (date: Date | undefined) => {
    onDateChange({
      ...dateRange,
      from: date,
    });
  };

  const handleToChange = (date: Date | undefined) => {
    onDateChange({
      ...dateRange,
      to: date,
    });
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
        />
        
        <DatePicker
          date={dateRange.to}
          setDate={handleToChange}
          label="Vyberte den odjezdu"
          placeholder="Odjezd"
          disabledDates={disabledDates}
          className="flex-1"
        />
        
        <Button 
          onClick={onSearch}
          className="bg-forest-600 hover:bg-forest-700 h-12 md:w-[180px]"
        >
          VYHLEDÁVÁNÍ
        </Button>
      </div>
    </div>
  );
};

export default DateRangePicker;
