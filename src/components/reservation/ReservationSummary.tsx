
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
    <div className="mb-8 p-6 bg-green-50 rounded-lg border border-green-100 shadow-sm">
      <h3 className="text-xl font-medium mb-4 text-forest-700">Souhrn rezervace</h3>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-white p-4 rounded border border-green-100">
          <p className="text-sm text-forest-600 mb-1">Příjezd:</p>
          <p className="font-medium text-lg">{format(dateRange.from, 'PPP', { locale: cs })}</p>
        </div>
        
        <div className="bg-white p-4 rounded border border-green-100">
          <p className="text-sm text-forest-600 mb-1">Odjezd:</p>
          <p className="font-medium text-lg">{format(dateRange.to, 'PPP', { locale: cs })}</p>
        </div>
        
        <div className="bg-white p-4 rounded border border-green-100">
          <p className="text-sm text-forest-600 mb-1">Počet nocí:</p>
          <p className="font-medium text-lg">{calculateNights()}</p>
        </div>
        
        <div className="bg-white p-4 rounded border border-green-100">
          <p className="text-sm text-forest-600 mb-1">Celková cena:</p>
          <p className="font-medium text-lg text-forest-700">{calculatePrice().toLocaleString()} Kč</p>
        </div>
      </div>
    </div>
  );
};

export default ReservationSummary;
