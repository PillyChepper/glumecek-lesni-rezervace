
import { Check } from 'lucide-react';

const ReservationPaymentInfo = () => {
  return (
    <div className="p-4 bg-green-50 rounded-md">
      <h3 className="font-medium flex items-center gap-2 mb-2 text-forest-700">
        <Check className="h-5 w-5" /> Informace o platbě
      </h3>
      <p className="text-sm text-forest-700">Po potvrzení rezervace obdržíte email s QR kódem pro provedení platby.</p>
    </div>
  );
};

export default ReservationPaymentInfo;
