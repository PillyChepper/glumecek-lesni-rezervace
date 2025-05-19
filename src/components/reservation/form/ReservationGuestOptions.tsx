
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface ReservationGuestOptionsProps {
  numOfGuests: number;
  handleGuestChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hasPet: boolean;
  setHasPet: (value: boolean) => void;
}

const ReservationGuestOptions = ({
  numOfGuests,
  handleGuestChange,
  hasPet,
  setHasPet
}: ReservationGuestOptionsProps) => {
  return (
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
      <div className="flex items-center space-x-2 h-full pt-8">
        <Checkbox 
          id="pet" 
          checked={hasPet}
          onCheckedChange={(checked) => setHasPet(checked === true)} 
        />
        <Label htmlFor="pet" className="cursor-pointer">Přijedu s pejskem</Label>
      </div>
    </div>
  );
};

export default ReservationGuestOptions;
