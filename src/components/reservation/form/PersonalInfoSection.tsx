
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, AlertCircle } from 'lucide-react';

interface PersonalInfoSectionProps {
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
}

const PersonalInfoSection = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  phone,
  setPhone
}: PersonalInfoSectionProps) => {
  const [emailError, setEmailError] = useState<string | null>(null);

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
  
  return (
    <Card className="border-t-4 border-t-forest-600">
      <CardContent className="pt-6">
        <div className="flex items-center mb-4">
          <User className="h-5 w-5 text-forest-600 mr-2" />
          <CardTitle className="text-lg">Osobní údaje</CardTitle>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
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
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center mb-1">
            <Mail className="h-4 w-4 text-forest-600 mr-2" />
            <Label htmlFor="email">Email *</Label>
          </div>
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
          <div className="flex items-center mb-1">
            <Phone className="h-4 w-4 text-forest-600 mr-2" />
            <Label htmlFor="phone">Telefon *</Label>
          </div>
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
      </CardContent>
    </Card>
  );
};

export default PersonalInfoSection;
