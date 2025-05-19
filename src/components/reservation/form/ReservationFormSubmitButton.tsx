
import { Button } from '@/components/ui/button';

interface ReservationFormSubmitButtonProps {
  isSubmitting: boolean;
}

const ReservationFormSubmitButton = ({ isSubmitting }: ReservationFormSubmitButtonProps) => {
  return (
    <Button 
      className="w-full bg-forest-600 hover:bg-forest-700" 
      type="submit"
      disabled={isSubmitting}
    >
      {isSubmitting ? "Odesílání..." : "Dokončit rezervaci"}
    </Button>
  );
};

export default ReservationFormSubmitButton;
