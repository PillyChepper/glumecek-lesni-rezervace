
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DateRange } from '@/components/DateRangePicker';
import { useToast } from '@/components/ui/use-toast';
import { createReservation } from '@/lib/supabase/reservations';
import { Checkbox } from '@/components/ui/checkbox';

interface ContactFormProps {
  dateRange: DateRange;
  onSubmit: (e: React.FormEvent) => void;
}

const ContactForm = ({ dateRange, onSubmit }: ContactFormProps) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [numOfGuests, setNumOfGuests] = useState<number>(2);
  const [hasPet, setHasPet] = useState(false);
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGuestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumOfGuests(Number(e.target.value));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dateRange.from || !dateRange.to) {
      toast({
        title: "Chyba při rezervaci",
        description: "Prosím vyberte datum příjezdu a odjezdu",
        variant: "destructive",
      });
      return;
    }

    if (!firstName || !lastName || !email || !phone) {
      toast({
        title: "Chyba při rezervaci",
        description: "Prosím vyplňte všechny povinné údaje",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await createReservation({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        arrival_date: dateRange.from.toISOString(),
        departure_date: dateRange.to.toISOString(),
        number_of_guests: numOfGuests,
        number_of_pets: hasPet ? 1 : 0,
        special_requests: specialRequests,
        payment_method: 'qr-code'
      });
      
      if (error) throw error;
      
      toast({
        title: "Rezervace odeslána",
        description: "Vaše rezervace byla úspěšně odeslána. Brzy vás budeme kontaktovat.",
      });
      
      // Call the original onSubmit to maintain existing behavior
      onSubmit(e);
      
      // Reset form
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setNumOfGuests(2);
      setHasPet(false);
      setSpecialRequests('');
      
      // Navigate to homepage after submission
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast({
        title: "Chyba při rezervaci",
        description: "Došlo k chybě při odesílání rezervace. Prosím zkuste to znovu později.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-display font-medium mb-4 text-forest-700">Vyplňte své údaje</h2>
      
      <Card>
        <form onSubmit={handleFormSubmit}>
          <CardHeader>
            <CardTitle>Kontaktní informace</CardTitle>
            <CardDescription>Prosím vyplňte své údaje pro dokončení rezervace</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guests">Počet osob</Label>
                <Input 
                  id="guests" 
                  type="number" 
                  min={1}
                  max={4}
                  value={numOfGuests}
                  onChange={handleGuestChange}
                />
              </div>
              <div className="flex items-center space-x-2 h-full pt-8">
                <Checkbox 
                  id="pet" 
                  checked={hasPet}
                  onCheckedChange={(checked) => setHasPet(checked === true)} 
                />
                <Label htmlFor="pet" className="cursor-pointer">Přijedu s pejskem</Label>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="requests">Zvláštní požadavky</Label>
              <Textarea 
                id="requests" 
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Máte nějaké zvláštní požadavky nebo přání? Dejte nám vědět."
              />
            </div>
            
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-forest-700">Platba bude provedena pomocí QR kódu po potvrzení rezervace.</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-forest-600 hover:bg-forest-700" 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Odesílání..." : "Dokončit rezervaci"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ContactForm;
