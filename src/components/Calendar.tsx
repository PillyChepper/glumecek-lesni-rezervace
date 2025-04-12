import { useState } from 'react';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

export type BookingDate = {
  from: Date | undefined;
  to: Date | undefined;
};

type CalendarProps = {
  disabledDates?: Date[];
  onBookingComplete?: (booking: BookingDate) => void;
};

const ReservationCalendar = ({ disabledDates = [], onBookingComplete }: CalendarProps) => {
  const [date, setDate] = useState<BookingDate>({
    from: undefined,
    to: undefined,
  });
  
  const { toast } = useToast();

  const handleSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    setDate(prev => {
      // If no start date is selected or both dates are selected, set the start date
      if (!prev.from || (prev.from && prev.to)) {
        return {
          from: selectedDate,
          to: undefined,
        };
      }
      
      // If the selected date is before the start date, swap them
      if (selectedDate < prev.from) {
        return {
          from: selectedDate,
          to: prev.from,
        };
      }
      
      // Otherwise, set the end date
      return {
        from: prev.from,
        to: selectedDate,
      };
    });
  };

  const isDateDisabled = (date: Date) => {
    return disabledDates.some(disabledDate => 
      disabledDate.getDate() === date.getDate() &&
      disabledDate.getMonth() === date.getMonth() &&
      disabledDate.getFullYear() === date.getFullYear()
    );
  };

  const handleReservationSubmit = () => {
    if (!date.from || !date.to) {
      toast({
        title: "Chyba při rezervaci",
        description: "Prosím vyberte datum příjezdu a odjezdu",
        variant: "destructive",
      });
      return;
    }

    // In a real application, you would send the booking data to a server here
    // For now, we'll just display a success message
    toast({
      title: "Rezervace odeslána",
      description: `Vaše rezervace od ${format(date.from, 'P', { locale: cs })} do ${format(date.to, 'P', { locale: cs })} byla úspěšně odeslána. Brzy vás budeme kontaktovat.`,
    });

    if (onBookingComplete) {
      onBookingComplete(date);
    }
  };

  const calculateNights = () => {
    if (!date.from || !date.to) return 0;
    
    const start = new Date(date.from);
    const end = new Date(date.to);
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
        <CardTitle>Rezervace pobytu</CardTitle>
        <CardDescription>Vyberte datum příjezdu a odjezdu</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <CalendarComponent
          mode="range"
          selected={{
            from: date.from,
            to: date.to,
          }}
          onSelect={(range) => {
            if (range?.from) {
              setDate({
                from: range.from,
                to: range.to,
              });
            }
          }}
          numberOfMonths={1}
          disabled={isDateDisabled}
          className="rounded-md border pointer-events-auto"
          locale={cs}
        />

        {date.from && date.to && (
          <div className="mt-6 w-full">
            <div className="flex justify-between items-center mb-2">
              <span>Datum příjezdu:</span>
              <span className="font-medium">{format(date.from, 'P', { locale: cs })}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span>Datum odjezdu:</span>
              <span className="font-medium">{format(date.to, 'P', { locale: cs })}</span>
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
          className="bg-forest-600 hover:bg-forest-700" 
          onClick={handleReservationSubmit}
          disabled={!date.from || !date.to}
        >
          Rezervovat pobyt
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReservationCalendar;
