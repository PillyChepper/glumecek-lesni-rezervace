
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { DateRange } from '@/components/DateRangePicker';
import Footer from '@/components/Footer';
import ReservationDatePicker from '@/components/reservation/ReservationDatePicker';
import ReservationSummary from '@/components/reservation/ReservationSummary';
import ContactForm from '@/components/reservation/ContactForm';

const Rezervace = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [showContactForm, setShowContactForm] = useState(false);
  
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dateRange.from || !dateRange.to) {
      toast({
        title: "Chyba při rezervaci",
        description: "Prosím vyberte datum příjezdu a odjezdu",
        variant: "destructive",
      });
      return;
    }
    
    // Check if required fields are filled - the ContactForm component will handle validation of required fields
    
    // In a real application, this would send data to a backend
    toast({
      title: "Rezervace odeslána",
      description: `Vaše rezervace byla úspěšně odeslána. Brzy vás budeme kontaktovat.`,
    });

    // Reset form
    setShowContactForm(false);
    setDateRange({ from: undefined, to: undefined });
  };

  const handleReservationClick = () => {
    setShowContactForm(true);
  };

  // Create sample disabled dates - create consecutive ranges for testing
  const createReservationRange = (startDate: Date, numDays: number): Date[] => {
    const dates: Date[] = [];
    const currentDate = new Date(startDate);
    
    for (let i = 0; i < numDays; i++) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };
  
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  
  // Sample reservation 1: 5-day stay
  const startDate1 = new Date(currentYear, currentMonth, 15);
  const range1 = createReservationRange(startDate1, 6); // 15th - 20th
  
  // Sample reservation 2: 3-day stay later in the month
  const startDate2 = new Date(currentYear, currentMonth, 25);
  const range2 = createReservationRange(startDate2, 4); // 25th - 28th
  
  // Combine all reservation ranges
  const disabledDates = [...range1, ...range2];
  
  console.log("Disabled dates on page:", disabledDates);
  
  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-display font-medium mb-8 text-forest-800 text-center">Rezervace pobytu</h1>
          
          <ReservationDatePicker
            dateRange={dateRange}
            onDateChange={setDateRange}
            onReservationClick={handleReservationClick}
            disabledDates={disabledDates}
          />

          {dateRange.from && dateRange.to && (
            <ReservationSummary dateRange={dateRange} />
          )}
          
          {showContactForm && (
            <ContactForm 
              dateRange={dateRange}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Rezervace;
