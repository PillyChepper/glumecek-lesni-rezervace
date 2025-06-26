
import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Calendar, User, MapPin, PawPrint, MessageSquare, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import ReservationFormSubmitButton from './ReservationFormSubmitButton';

interface ReservationConfirmViewProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  hasPet: boolean;
  specialRequests: string;
  isSubmitting: boolean;
  onBackClick: (e: React.MouseEvent) => void;
}

const ReservationConfirmView = ({
  firstName,
  lastName,
  email,
  phone,
  street,
  city,
  postalCode,
  hasPet,
  specialRequests,
  isSubmitting,
  onBackClick
}: ReservationConfirmViewProps) => {
  return (
    <>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-600" />
        </div>
        <CardTitle className="text-2xl text-forest-700">Potvrzení rezervace</CardTitle>
        <CardDescription className="text-base">
          Zkontrolujte prosím všechny údaje před dokončením rezervace
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Personal Information Section */}
        <div className="bg-forest-50 rounded-lg p-4 border border-forest-200">
          <div className="flex items-center gap-2 mb-3">
            <User className="h-5 w-5 text-forest-600" />
            <h3 className="font-semibold text-forest-700">Osobní údaje</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <span className="text-sm text-forest-600 font-medium">Jméno a příjmení:</span>
              <p className="text-forest-800">{firstName} {lastName}</p>
            </div>
            <div>
              <span className="text-sm text-forest-600 font-medium">Email:</span>
              <p className="text-forest-800">{email}</p>
            </div>
            <div>
              <span className="text-sm text-forest-600 font-medium">Telefon:</span>
              <p className="text-forest-800">{phone}</p>
            </div>
          </div>
        </div>

        {/* Address Section */}
        {(street || city || postalCode) && (
          <div className="bg-forest-50 rounded-lg p-4 border border-forest-200">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-5 w-5 text-forest-600" />
              <h3 className="font-semibold text-forest-700">Adresa</h3>
            </div>
            <div className="space-y-1">
              {street && <p className="text-forest-800">{street}</p>}
              <p className="text-forest-800">
                {city && city}{postalCode && `, ${postalCode}`}
              </p>
            </div>
          </div>
        )}

        {/* Stay Details Section */}
        <div className="bg-forest-50 rounded-lg p-4 border border-forest-200">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-5 w-5 text-forest-600" />
            <h3 className="font-semibold text-forest-700">Detaily pobytu</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <PawPrint className="h-4 w-4 text-forest-600" />
              <span className="text-sm text-forest-600 font-medium">Domácí mazlíček:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                hasPet ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {hasPet ? 'Ano' : 'Ne'}
              </span>
            </div>
            {specialRequests && (
              <div className="flex items-start gap-2">
                <MessageSquare className="h-4 w-4 text-forest-600 mt-0.5" />
                <div>
                  <span className="text-sm text-forest-600 font-medium">Zvláštní požadavky:</span>
                  <p className="text-forest-800 text-sm mt-1">{specialRequests}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-green-700">Informace o platbě</h3>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <p className="text-green-800 text-sm">
              Po potvrzení rezervace obdržíte email s QR kódem pro provedení platby. 
              Platbu můžete provést bezpečně pomocí bankovního převodu nebo mobilní aplikace.
            </p>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
          <p className="text-amber-800 text-sm font-medium">
            ⚠️ Prosím zkontrolujte všechny údaje před odesláním. Po potvrzení bude vaše rezervace zaregistrována.
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row gap-3 pt-6">
        <Button 
          variant="outline" 
          type="button"
          onClick={onBackClick}
          className="w-full sm:w-auto border-forest-300 text-forest-700 hover:bg-forest-50"
        >
          ← Zpět k údajům
        </Button>
        <ReservationFormSubmitButton isSubmitting={isSubmitting} />
      </CardFooter>
    </>
  );
};

export default ReservationConfirmView;
