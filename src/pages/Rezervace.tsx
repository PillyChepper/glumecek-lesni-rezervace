
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { DateRange } from '@/components/DateRangePicker';
import Footer from '@/components/Footer';
import ReservationDatePicker from '@/components/reservation/ReservationDatePicker';
import ReservationSummary from '@/components/reservation/ReservationSummary';
import ContactForm from '@/components/reservation/ContactForm';
import { useReservationDatesWithRefresh } from '@/hooks/useReservationDatesWithRefresh';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Rezervace = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [showContactForm, setShowContactForm] = useState(false);
  
  const { toast } = useToast();
  const { disabledDates, loading, error, refreshDates, isSupabaseConnected } = useReservationDatesWithRefresh();
  
  // Debug log disabledDates
  useEffect(() => {
    console.log('Number of disabled dates:', disabledDates.length);
    if (disabledDates.length > 0) {
      console.log('Rezervace page - Disabled dates:', disabledDates);
    }
  }, [disabledDates]);
  
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
  
  // Display connection status to help debug
  const connectionStatus = isSupabaseConnected !== undefined ? (
    isSupabaseConnected ? 'Connected to database' : 'Not connected to database'
  ) : 'Checking connection...';
  
  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="section-title text-center mb-8">Rezervace pobytu</h1>
          
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Chyba při načítání dat</AlertTitle>
              <AlertDescription className="flex flex-col gap-3">
                <p>{error}</p>
                <div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2"
                    onClick={() => refreshDates()}
                  >
                    <RefreshCcw className="h-4 w-4" />
                    Zkusit znovu
                  </Button>
                </div>
                <div className="text-xs opacity-70">{connectionStatus}</div>
              </AlertDescription>
            </Alert>
          )}
          
          {!error && (
            <div className="bg-forest-50/50 p-3 rounded-md mb-6 text-xs text-forest-700 flex items-center justify-center">
              <span className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isSupabaseConnected ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                {connectionStatus}
              </span>
            </div>
          )}
          
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
