
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import ReservationContactInfo from './ReservationContactInfo';
import ReservationGuestOptions from './ReservationGuestOptions';
import ReservationSpecialRequests from './ReservationSpecialRequests';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ReservationContactViewProps {
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  street: string;
  setStreet: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  postalCode: string;
  setPostalCode: (value: string) => void;
  hasPet: boolean;
  setHasPet: (value: boolean) => void;
  specialRequests: string;
  setSpecialRequests: (value: string) => void;
  onContinueClick: () => void;
  emailError?: string | null;
  validateEmail?: (email: string) => boolean;
  isEmailValid?: () => boolean;
}

const ReservationContactView = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  phone,
  setPhone,
  street,
  setStreet,
  city,
  setCity,
  postalCode,
  setPostalCode,
  hasPet,
  setHasPet,
  specialRequests,
  setSpecialRequests,
  onContinueClick,
  emailError,
  validateEmail,
  isEmailValid
}: ReservationContactViewProps) => {
  const canContinue = firstName && lastName && email && phone && isEmailValid && isEmailValid();

  return (
    <>
      <CardHeader>
        <CardTitle>Kontaktní informace</CardTitle>
        <CardDescription>Prosím vyplňte své údaje pro dokončení rezervace</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ReservationContactInfo 
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          email={email}
          setEmail={setEmail}
          phone={phone}
          setPhone={setPhone}
          street={street}
          setStreet={setStreet}
          city={city}
          setCity={setCity}
          postalCode={postalCode}
          setPostalCode={setPostalCode}
          emailError={emailError}
          validateEmail={validateEmail}
        />
        
        <ReservationGuestOptions 
          hasPet={hasPet}
          setHasPet={setHasPet}
        />
        
        <ReservationSpecialRequests 
          specialRequests={specialRequests}
          setSpecialRequests={setSpecialRequests}
        />
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-[#4a544a] hover:bg-[#3d443d] text-white"
          onClick={onContinueClick}
          disabled={!canContinue}
          type="button"
        >
          <ArrowRight className="h-4 w-4 mr-1" />
          Pokračovat k potvrzení
        </Button>
      </CardFooter>
    </>
  );
};

export default ReservationContactView;
