
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { DateRange } from '@/components/DateRangePicker';

interface ReservationSummaryProps {
  dateRange: DateRange;
}

const ReservationSummary = ({ dateRange }: ReservationSummaryProps) => {
  const calculateNights = () => {
    if (!dateRange.from || !dateRange.to) return 0;
    
    const start = new Date(dateRange.from);
    const end = new Date(dateRange.to);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const calculatePrice = () => {
    const nights = calculateNights();
    // Adjust the price per night as needed
    const pricePerNight = 2500;
    return nights * pricePerNight;
  };

  if (!dateRange.from || !dateRange.to) return null;

  return (
    <div className="mb-8 p-4 bg-green-50 rounded-lg border border-green-100">
      <h3 className="text-lg font-medium mb-2 text-forest-700">Souhrn rezervace</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-forest-600">Příjezd:</p>
          <p className="font-medium">{format(dateRange.from, 'PPP', { locale: cs })}</p>
        </div>
        <div>
          <p className="text-sm text-forest-600">Odjezd:</p>
          <p className="font-medium">{format(dateRange.to, 'PPP', { locale: cs })}</p>
        </div>
        <div>
          <p className="text-sm text-forest-600">Počet nocí:</p>
          <p className="font-medium">{calculateNights()}</p>
        </div>
        <div>
          <p className="text-sm text-forest-600">Celková cena:</p>
          <p className="font-medium">{calculatePrice()} Kč</p>
        </div>
      </div>
    </div>
  );
};

export default ReservationSummary;
