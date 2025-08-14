import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useFormContext } from 'react-hook-form';
import ReservationContactInfoRHF from './ReservationContactInfoRHF';
import ReservationGuestOptionsRHF from './ReservationGuestOptionsRHF';
import ReservationSpecialRequestsRHF from './ReservationSpecialRequestsRHF';
import { type ReservationFormData } from '@/schemas/reservationFormSchema';

interface ReservationContactViewRHFProps {
  onContinueClick: () => void;
}

const ReservationContactViewRHF = ({ onContinueClick }: ReservationContactViewRHFProps) => {
  const form = useFormContext<ReservationFormData>();
  
  
  const isFormValid = () => {
    const { firstName, lastName, email, phone } = form.getValues();
    const { errors } = form.formState;
    return firstName && lastName && email && phone && Object.keys(errors).length === 0;
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Vyplňte své údaje</CardTitle>
        <CardDescription>Prosím vyplňte požadované informace pro dokončení rezervace</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ReservationContactInfoRHF />
        <ReservationGuestOptionsRHF />
        <ReservationSpecialRequestsRHF />
      </CardContent>
      <CardFooter>
        <Button 
          type="button"
          onClick={onContinueClick}
          disabled={!isFormValid()}
          className="w-full"
        >
          Pokračovat k potvrzení
        </Button>
      </CardFooter>
    </>
  );
};

export default ReservationContactViewRHF;