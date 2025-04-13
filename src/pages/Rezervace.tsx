
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { DateRange } from '@/components/DateRangePicker';
import Footer from '@/components/Footer';
import ReservationDatePicker from '@/components/reservation/ReservationDatePicker';
import ReservationSummary from '@/components/reservation/ReservationSummary';
import ContactForm from '@/components/reservation/ContactForm';
import { useReservationDates } from '@/hooks/useReservationDates';
import { Spinner } from '@/components/ui/spinner';

const Rezervace = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [showContactForm, setShowContactForm] = useState(false);
  
  const { toast } = useToast();
  const { disabledDates, loading } = useReservationDates();
  
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
    
    // ContactForm now handles the form submission and API call
    
    // Just reset the state in this component
    setShowContactForm(false);
    setDateRange({ from: undefined, to: undefined });
  };

  const handleReservationClick = () => {
    setShowContactForm(true);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-display font-medium mb-8 text-forest-800 text-center">Rezervace pobytu</h1>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner className="h-8 w-8 text-forest-600" />
            </div>
          ) : (
            <ReservationDatePicker
              dateRange={dateRange}
              onDateChange={setDateRange}
              onReservationClick={handleReservationClick}
              disabledDates={disabledDates}
            />
          )}

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
