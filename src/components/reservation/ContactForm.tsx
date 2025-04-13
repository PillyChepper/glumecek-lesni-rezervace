
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DateRange } from '@/components/DateRangePicker';

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
  const [numOfPets, setNumOfPets] = useState<number>(0);
  const [specialRequests, setSpecialRequests] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank-transfer');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  const handleGuestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumOfGuests(Number(e.target.value));
  };
  
  const handlePetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumOfPets(Number(e.target.value));
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl md:text-2xl font-display font-medium mb-4 text-forest-700">Vyplňte své údaje</h2>
      
      <Card className="shadow-sm">
        <form onSubmit={handleFormSubmit}>
          <CardHeader>
            <CardTitle>Kontaktní informace</CardTitle>
            <CardDescription>Prosím vyplňte své údaje pro dokončení rezervace</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                  <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                  <Label htmlFor="bank-transfer" className="cursor-pointer">Bankovní převod</Label>
                </div>
                <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="cursor-pointer">Hotovost při příjezdu</Label>
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
  );
};

export default ContactForm;
