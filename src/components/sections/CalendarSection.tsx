
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Section from '@/components/Section';
import EnhancedAvailabilityCalendar from '@/components/calendar/EnhancedAvailabilityCalendar';
import DateRangePicker, { DateRange } from '@/components/DateRangePicker';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { useReservationDatesWithRefresh } from '@/hooks/useReservationDatesWithRefresh';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, CalendarDays } from 'lucide-react';

const CalendarSection = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  
  const navigate = useNavigate();
  const { disabledDates, loading, error } = useReservationDatesWithRefresh();

  const handleReservationClick = () => {
    // Only navigate if both dates are selected
    if (dateRange.from && dateRange.to) {
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

  const handleDateRangeSelect = (from: Date, to: Date) => {
    setDateRange({ from, to });
    // Auto-navigate to booking page
    const fromDate = from.toISOString();
    const toDate = to.toISOString();
    navigate(`/rezervace?from=${fromDate}&to=${toDate}`);
  };

  if (loading) {
    return (
      <Section id="kalendar">
        <div className="flex justify-center items-center h-64">
          <Spinner className="h-8 w-8 text-forest-600" />
        </div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section id="kalendar">
        <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-md text-center">
          <p className="mb-4">{error}</p>
          <DateRangePicker 
            dateRange={dateRange}
            onDateChange={setDateRange}
            disabledDates={[]}
            onReservationClick={handleReservationClick}
          />
        </div>
      </Section>
    );
  }

  return (
    <Section id="kalendar">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="section-title">Dostupnost a rezervace</h2>
          <p className="text-muted-foreground">
            Prohlédněte si dostupnost na několik měsíců dopředu nebo rychle vyberte termín pro okamžitou rezervaci
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Přehled dostupnosti
            </TabsTrigger>
            <TabsTrigger value="booking" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Rychlá rezervace
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <EnhancedAvailabilityCalendar
              disabledDates={disabledDates}
              onDateRangeSelect={handleDateRangeSelect}
              showBookingCTA={true}
            />
          </TabsContent>
          
          <TabsContent value="booking" className="space-y-6">
            <div className="max-w-5xl mx-auto">
              <DateRangePicker 
                dateRange={dateRange}
                onDateChange={setDateRange}
                disabledDates={disabledDates}
                onReservationClick={handleReservationClick}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Section>
  );
};

export default CalendarSection;
