
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface ReservationFormSubmitButtonProps {
  isSubmitting: boolean;
}

const ReservationFormSubmitButton = ({ isSubmitting }: ReservationFormSubmitButtonProps) => {
  return (
    <Button 
      className="w-full bg-[#4a544a] hover:bg-[#3d443d] text-white" 
      type="submit"
      disabled={isSubmitting}
    >
      {isSubmitting ? "Odesílání..." : (
        <>
          <Check className="h-4 w-4" />
          Odeslat rezervaci
        </>
      )}
    </Button>
  );
};

export default ReservationFormSubmitButton;
