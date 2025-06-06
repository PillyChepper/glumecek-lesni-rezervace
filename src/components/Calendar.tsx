
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import DateRangePicker, { DateRange } from '@/components/DateRangePicker';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { useReservationDates } from '@/hooks/useReservationDates';
import { Spinner } from '@/components/ui/spinner';

type CalendarProps = {
  onBookingComplete?: (booking: DateRange) => void;
};

const ReservationCalendar = ({ onBookingComplete }: CalendarProps) => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  
  const { toast } = useToast();
  const { disabledDates, loading, error } = useReservationDates();

  const handleReservationSubmit = () => {
    if (!dateRange.from || !dateRange.to) {
      toast({
        title: "Chyba při rezervaci",
        description: "Prosím vyberte datum příjezdu a odjezdu",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Rezervace odeslána",
      description: `Vaše rezervace od ${format(dateRange.from, 'P', { locale: cs })} do ${format(dateRange.to, 'P', { locale: cs })} byla úspěšně odeslána. Brzy vás budeme kontaktovat.`,
    });

    if (onBookingComplete) {
      onBookingComplete(dateRange);
    }
  };

  const calculateNights = () => {
    if (!dateRange.from || !dateRange.to) return 0;
    
    const start = new Date(dateRange.from);
    const end = new Date(dateRange.to);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const calculatePrice = () => {
    const nights = calculateNights();
    // Adjust the price per night as needed
    const pricePerNight = 2500;
    return nights * pricePerNight;
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="section-title text-center">Rezervace pobytu</CardTitle>
        <CardDescription className="text-center text-lg">Vyberte datum příjezdu a odjezdu</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Spinner className="h-8 w-8 text-forest-600" />
          </div>
        ) : (
          <DateRangePicker 
            dateRange={dateRange}
            onDateChange={setDateRange}
            disabledDates={disabledDates}
          />
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md text-sm">
            {error}
          </div>
        )}

        {dateRange.from && dateRange.to && (
          <div className="mt-6 w-full">
            <div className="flex justify-between items-center mb-2">
              <span>Datum příjezdu:</span>
              <span className="font-medium">{format(dateRange.from, 'P', { locale: cs })}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span>Datum odjezdu:</span>
              <span className="font-medium">{format(dateRange.to, 'P', { locale: cs })}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span>Počet nocí:</span>
              <span className="font-medium">{calculateNights()}</span>
            </div>
            <div className="flex justify-between items-center border-t pt-2 mt-2 text-lg font-medium">
              <span>Celková cena:</span>
              <span>{calculatePrice()} Kč</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          className="bg-forest-600 hover:bg-forest-700 text-white" 
          onClick={handleReservationSubmit}
          disabled={!dateRange.from || !dateRange.to}
        >
          Rezervovat pobyt
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReservationCalendar;
