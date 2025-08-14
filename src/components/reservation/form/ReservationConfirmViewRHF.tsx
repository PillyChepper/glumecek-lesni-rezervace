import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useFormContext } from 'react-hook-form';
import ReservationConfirmation from './ReservationConfirmation';
import ReservationFormSubmitButton from './ReservationFormSubmitButton';
import { type ReservationFormData } from '@/schemas/reservationFormSchema';

interface ReservationConfirmViewRHFProps {
  onBackClick: (e: React.MouseEvent) => void;
  isSubmitting: boolean;
}

const ReservationConfirmViewRHF = ({ onBackClick, isSubmitting }: ReservationConfirmViewRHFProps) => {
  const form = useFormContext<ReservationFormData>();
  const formData = form.getValues();

  return (
    <>
      <CardHeader>
        <CardTitle>Potvrzení rezervace</CardTitle>
        <CardDescription>Zkontrolujte prosím zadané údaje před odesláním rezervace</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ReservationConfirmation 
          firstName={formData.firstName}
          lastName={formData.lastName}
          email={formData.email}
          phone={formData.phone}
          street={formData.street || ''}
          city={formData.city || ''}
          postalCode={formData.postalCode || ''}
          hasPet={formData.hasPet}
          specialRequests={formData.specialRequests || ''}
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

export default ReservationConfirmViewRHF;