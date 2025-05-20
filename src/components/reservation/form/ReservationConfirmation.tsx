
import { Separator } from '@/components/ui/separator';
import ReservationPaymentInfo from './ReservationPaymentInfo';

interface ReservationConfirmationProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street?: string;
  city?: string;
  postalCode?: string;
  hasPet: boolean;
  specialRequests?: string;
}

const ReservationConfirmation = ({
  firstName,
  lastName,
  email,
  phone,
  street,
  city,
  postalCode,
  hasPet,
  specialRequests
}: ReservationConfirmationProps) => {
  return (
    <>
      <div>
        <h3 className="font-medium mb-2">Osobní údaje</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-muted-foreground">Jméno:</div>
          <div>{firstName} {lastName}</div>
          <div className="text-muted-foreground">Email:</div>
          <div>{email}</div>
          <div className="text-muted-foreground">Telefon:</div>
          <div>{phone}</div>
        </div>
      </div>
      
      <Separator />
      
      {/* Address confirmation */}
      {(street || city || postalCode) && (
        <>
          <div>
            <h3 className="font-medium mb-2">Adresa</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {street && (
                <>
                  <div className="text-muted-foreground">Ulice:</div>
                  <div>{street}</div>
                </>
              )}
              {city && (
                <>
                  <div className="text-muted-foreground">Město:</div>
                  <div>{city}</div>
                </>
              )}
              {postalCode && (
                <>
                  <div className="text-muted-foreground">PSČ:</div>
                  <div>{postalCode}</div>
                </>
              )}
            </div>
          </div>
          <Separator />
        </>
      )}
      
      <div>
        <h3 className="font-medium mb-2">Detaily pobytu</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-muted-foreground">Pejsek:</div>
          <div>{hasPet ? 'Ano' : 'Ne'}</div>
          {specialRequests && (
            <>
              <div className="text-muted-foreground">Zvláštní požadavky:</div>
              <div>{specialRequests}</div>
            </>
          )}
        </div>
      </div>
      
      <Separator />
      
      <ReservationPaymentInfo />
    </>
  );
};

export default ReservationConfirmation;
