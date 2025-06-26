
import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import ReservationConfirmation from './ReservationConfirmation';
import ReservationFormSubmitButton from './ReservationFormSubmitButton';

interface ReservationConfirmViewProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  hasPet: boolean;
  specialRequests: string;
  isSubmitting: boolean;
  onBackClick: (e: React.MouseEvent) => void;
}

const ReservationConfirmView = ({
  firstName,
  lastName,
  email,
  phone,
  street,
  city,
  postalCode,
  hasPet,
  specialRequests,
  isSubmitting,
  onBackClick
}: ReservationConfirmViewProps) => {
  return (
    <>
      <CardHeader>
        <CardTitle>Potvrzení rezervace</CardTitle>
        <CardDescription>Zkontrolujte prosím zadané údaje před odesláním rezervace</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ReservationConfirmation 
          firstName={firstName}
          lastName={lastName}
          email={email}
          phone={phone}
          street={street}
          city={city}
          postalCode={postalCode}
          hasPet={hasPet}
          specialRequests={specialRequests}
        />
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3">
        <Button 
          variant="outline" 
          type="button"
          onClick={onBackClick}
          className="w-full sm:w-auto"
        >
          Zpět k údajům
        </Button>
        <ReservationFormSubmitButton isSubmitting={isSubmitting} />
      </CardFooter>
    </>
  );
};

export default ReservationConfirmView;
