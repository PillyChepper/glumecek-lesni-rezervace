
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Section from '@/components/Section';
import DateRangePicker, { DateRange } from '@/components/DateRangePicker';
import { toast } from '@/components/ui/use-toast';

const CalendarSection = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const navigate = useNavigate();

  const disabledDates = [
    new Date(2025, 3, 15),
    new Date(2025, 3, 16),
    new Date(2025, 3, 17),
    new Date(2025, 3, 18),
  ];

  const handleSearch = () => {
    // Only navigate if both dates are selected
    if (dateRange.from && dateRange.to) {
      // Pass the selected dates to the reservation page through URL parameters
      const fromDate = dateRange.from.toISOString();
      const toDate = dateRange.to.toISOString();
      navigate(`/rezervace?from=${fromDate}&to=${toDate}`);
    } else {
      toast({
        title: "Vyberte datum",
        description: "Prosím vyberte datum příjezdu a odjezdu",
        variant: "destructive",
      });
    }
  };

  return (
    <Section id="kalendar">
      <div className="max-w-5xl mx-auto">
        <DateRangePicker 
          dateRange={dateRange}
          onDateChange={setDateRange}
          disabledDates={disabledDates}
          onSearch={handleSearch}
        />
      </div>
    </Section>
  );
};

export default CalendarSection;
