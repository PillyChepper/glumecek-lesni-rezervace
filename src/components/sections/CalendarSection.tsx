
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
  
  const navigate = useNavigate();

  const disabledDates = [
    new Date(2025, 3, 15),
    new Date(2025, 3, 16),
    new Date(2025, 3, 17),
    new Date(2025, 3, 18),
  ];

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
        <DateRangePicker 
          dateRange={dateRange}
          onDateChange={setDateRange}
          disabledDates={disabledDates}
          onReservationClick={handleReservationClick}
        />

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
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Příjmení *</Label>
                  <Input 
                    id="last-name" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
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
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon *</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                className="w-full bg-forest-600 hover:bg-forest-700" 
                onClick={handleSubmitContact}
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
