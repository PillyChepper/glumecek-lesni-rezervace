
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ReservationSpecialRequestsProps {
  specialRequests: string;
  setSpecialRequests: (value: string) => void;
}

const ReservationSpecialRequests = ({
  specialRequests,
  setSpecialRequests
}: ReservationSpecialRequestsProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="requests">Zvláštní požadavky</Label>
      <Textarea 
        id="requests" 
        value={specialRequests}
        onChange={(e) => setSpecialRequests(e.target.value)}
        placeholder="Máte nějaké zvláštní požadavky nebo přání? Dejte nám vědět."
      />
    </div>
  );
};

export default ReservationSpecialRequests;
