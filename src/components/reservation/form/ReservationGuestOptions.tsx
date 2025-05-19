
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface ReservationGuestOptionsProps {
  hasPet: boolean;
  setHasPet: (value: boolean) => void;
}

const ReservationGuestOptions = ({
  hasPet,
  setHasPet
}: ReservationGuestOptionsProps) => {
  return (
    <div className="flex items-center space-x-2 py-2">
      <Checkbox 
        id="pet" 
        checked={hasPet}
        onCheckedChange={(checked) => setHasPet(checked === true)} 
      />
      <Label htmlFor="pet" className="cursor-pointer">Přijedu s pejskem</Label>
    </div>
  );
};

export default ReservationGuestOptions;
