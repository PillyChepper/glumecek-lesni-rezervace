import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Section from '@/components/Section';
import DateRangePicker, { DateRange } from '@/components/DateRangePicker';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useReservationDatesWithRefresh } from '@/hooks/useReservationDatesWithRefresh';
import { Spinner } from '@/components/ui/spinner';
import { AlertCircle } from 'lucide-react';

const CalendarSection = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [showContactForm, setShowContactForm] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { disabledDates, loading, error } = useReservationDatesWithRefresh();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) && email.length > 0) {
      setEmailError('Prosím zadejte platnou emailovou adresu');
      return false;
    } else {
      setEmailError(null);
      return true;
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (newEmail.length > 3) {
      validateEmail(newEmail);
    } else {
      setEmailError(null);
    }
  };

  const handleReservationClick = () => {
    // Only open contact form dialog if both dates are selected
    if (dateRange.from && dateRange.to) {
      setShowContactForm(true);
    } else {
      toast({
        title: "Vyberte datum",
        description: "Prosím vyberte datum příjezdu a odjezdu",
        variant: "destructive",
      });
    }
  };

  const handleSubmitContact = () => {
    if (!firstName || !lastName || !email || !phone) {
      toast({
        title: "Vyplňte kontaktní údaje",
        description: "Prosím vyplňte všechny povinné údaje",
        variant: "destructive",
      });
      return;
    }

    // Validate email before submitting
    if (!validateEmail(email)) {
      return;
    }

    // Pass the selected dates to the reservation page through URL parameters
    if (dateRange.from && dateRange.to) {
      const fromDate = dateRange.from.toISOString();
      const toDate = dateRange.to.toISOString();
      navigate(`/rezervace?from=${fromDate}&to=${toDate}`);
      setShowContactForm(false);
    }
  };

  return (
    <Section id="kalendar">
      <div className="max-w-5xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner className="h-8 w-8 text-forest-600" />
          </div>
        ) : (
          <DateRangePicker 
            dateRange={dateRange}
            onDateChange={setDateRange}
            disabledDates={disabledDates}
            onReservationClick={handleReservationClick}
          />
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-md">
            {error}
          </div>
        )}

        <Dialog open={showContactForm} onOpenChange={setShowContactForm}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Kontaktní údaje</DialogTitle>
              <DialogDescription>
                Prosím vyplňte kontaktní údaje pro dokončení rezervace
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">Jméno *</Label>
                  <Input 
                    id="first-name" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Zadejte jméno"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Příjmení *</Label>
                  <Input 
                    id="last-name" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Zadejte příjmení"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => email && validateEmail(email)}
                  placeholder="Zadejte emailovou adresu"
                  className={emailError ? "border-red-500" : ""}
                  required
                />
                {emailError && (
                  <div className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {emailError}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon *</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  isNumeric={true}
                  placeholder="Zadejte telefonní číslo"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                className="w-full bg-forest-600 hover:bg-forest-700" 
                onClick={handleSubmitContact}
                disabled={emailError !== null && email.length > 0}
              >
                Dokončit rezervaci
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Section>
  );
};

export default CalendarSection;
