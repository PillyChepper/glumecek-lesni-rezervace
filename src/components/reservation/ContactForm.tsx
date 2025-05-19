
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRange } from '@/components/DateRangePicker';
import ReservationContactInfo from './form/ReservationContactInfo';
import ReservationGuestOptions from './form/ReservationGuestOptions';
import ReservationSpecialRequests from './form/ReservationSpecialRequests';
import ReservationPaymentInfo from './form/ReservationPaymentInfo';
import ReservationFormSubmitButton from './form/ReservationFormSubmitButton';
import { useReservationForm } from './form/useReservationForm';

interface ContactFormProps {
  dateRange: DateRange;
  onSubmit: (e: React.FormEvent) => void;
}

const ContactForm = ({ dateRange, onSubmit }: ContactFormProps) => {
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    phone,
    setPhone,
    numOfGuests,
    hasPet,
    setHasPet,
    specialRequests,
    setSpecialRequests,
    isSubmitting,
    handleGuestChange,
    handleFormSubmit
  } = useReservationForm(dateRange, onSubmit);

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-display font-medium mb-4 text-forest-700">Vyplňte své údaje</h2>
      
      <Card>
        <form onSubmit={handleFormSubmit}>
          <CardHeader>
            <CardTitle>Kontaktní informace</CardTitle>
            <CardDescription>Prosím vyplňte své údaje pro dokončení rezervace</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ReservationContactInfo 
              firstName={firstName}
              setFirstName={setFirstName}
              lastName={lastName}
              setLastName={setLastName}
              email={email}
              setEmail={setEmail}
              phone={phone}
              setPhone={setPhone}
            />
            
            <ReservationGuestOptions 
              numOfGuests={numOfGuests}
              handleGuestChange={handleGuestChange}
              hasPet={hasPet}
              setHasPet={setHasPet}
            />
            
            <ReservationSpecialRequests 
              specialRequests={specialRequests}
              setSpecialRequests={setSpecialRequests}
            />
            
            <ReservationPaymentInfo />
          </CardContent>
          <CardFooter>
            <ReservationFormSubmitButton isSubmitting={isSubmitting} />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ContactForm;
