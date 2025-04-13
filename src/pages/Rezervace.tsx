import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import DateRangePicker, { DateRange } from '@/components/DateRangePicker';

const Rezervace = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [numOfGuests, setNumOfGuests] = useState<number>(2);
  const [numOfPets, setNumOfPets] = useState<number>(0);
  const [specialRequests, setSpecialRequests] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank-transfer');
  
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
    
    if (!firstName || !lastName || !email || !phone) {
      toast({
        title: "Chyba při rezervaci",
        description: "Prosím vyplňte všechny povinné údaje",
        variant: "destructive",
      });
      return;
    }
    
    // In a real application, this would send data to a backend
    toast({
      title: "Rezervace odeslána",
      description: `Vaše rezervace od ${format(dateRange.from, 'P', { locale: cs })} do ${format(dateRange.to, 'P', { locale: cs })} byla úspěšně odeslána. Brzy vás budeme kontaktovat.`,
    });
  };
  
  const handleGuestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumOfGuests(Number(e.target.value));
  };
  
  const handlePetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumOfPets(Number(e.target.value));
  };

  const disabledDates = [
    new Date(2025, 3, 15),
    new Date(2025, 3, 16),
    new Date(2025, 3, 17),
    new Date(2025, 3, 18),
  ];
  
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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-display font-medium mb-8 text-forest-800 text-center">Rezervace pobytu</h1>
          
          <div className="mb-12">
            <DateRangePicker 
              dateRange={dateRange}
              onDateChange={setDateRange}
              disabledDates={disabledDates}
            />
          </div>

          {dateRange.from && dateRange.to && (
            <div className="mb-8 p-4 bg-green-50 rounded-lg border border-green-100">
              <h3 className="text-lg font-medium mb-2 text-forest-700">Souhrn rezervace</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-forest-600">Příjezd:</p>
                  <p className="font-medium">{format(dateRange.from, 'PPP', { locale: cs })}</p>
                </div>
                <div>
                  <p className="text-sm text-forest-600">Odjezd:</p>
                  <p className="font-medium">{format(dateRange.to, 'PPP', { locale: cs })}</p>
                </div>
                <div>
                  <p className="text-sm text-forest-600">Počet nocí:</p>
                  <p className="font-medium">{calculateNights()}</p>
                </div>
                <div>
                  <p className="text-sm text-forest-600">Celková cena:</p>
                  <p className="font-medium">{calculatePrice()} Kč</p>
                </div>
              </div>
            </div>
          )}
          
          <div>
            <h2 className="text-xl md:text-2xl font-display font-medium mb-4 text-forest-700">Vyplňte své údaje</h2>
            
            <Card>
              <form onSubmit={handleSubmit}>
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
                    <div className="space-y-2">
                      <Label htmlFor="pets">Počet mazlíčků</Label>
                      <Input 
                        id="pets" 
                        type="number" 
                        min={0}
                        max={2}
                        value={numOfPets}
                        onChange={handlePetChange}
                      />
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
                  
                  <div className="space-y-2">
                    <Label>Způsob platby</Label>
                    <RadioGroup defaultValue="bank-transfer" value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                        <Label htmlFor="bank-transfer">Bankovní převod</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash">Hotovost při příjezdu</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-forest-600 hover:bg-forest-700" 
                    type="submit"
                  >
                    Dokončit rezervaci
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Rezervace;
