
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { DateRange } from '@/components/DateRangePicker';
import { useReservationForm } from './form/useReservationForm';
import BookingSteps, { BookingStep } from './BookingSteps';
import ReservationContactView from './form/ReservationContactView';
import ReservationConfirmView from './form/ReservationConfirmView';

interface ContactFormProps {
  dateRange: DateRange;
  onSubmit: (e: React.FormEvent) => void;
}

const ContactForm = ({ dateRange, onSubmit }: ContactFormProps) => {
  const [currentStep, setCurrentStep] = useState<BookingStep>('contact');
  
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    phone,
    setPhone,
    street,
    setStreet,
    city,
    setCity,
    postalCode,
    setPostalCode,
    hasPet,
    setHasPet,
    specialRequests,
    setSpecialRequests,
    isSubmitting,
    handleFormSubmit
  } = useReservationForm(dateRange, onSubmit);

  const handleContinueToConfirm = () => {
    if (!firstName || !lastName || !email || !phone) {
      return;
    }
    setCurrentStep('confirm');
  };
  
  const handleBackToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentStep('contact');
  };

  return (
    <div>
      <BookingSteps currentStep={currentStep} />
      
      <h2 className="text-xl md:text-2xl font-display font-medium mb-4 text-forest-700">
        {currentStep === 'contact' ? 'Vyplňte své údaje' : 'Potvrzení rezervace'}
      </h2>
      
      <Card>
        <form onSubmit={handleFormSubmit}>
          {currentStep === 'contact' ? (
            <ReservationContactView 
              firstName={firstName}
              setFirstName={setFirstName}
              lastName={lastName}
              setLastName={setLastName}
              email={email}
              setEmail={setEmail}
              phone={phone}
              setPhone={setPhone}
              street={street}
              setStreet={setStreet}
              city={city}
              setCity={setCity}
              postalCode={postalCode}
              setPostalCode={setPostalCode}
              hasPet={hasPet}
              setHasPet={setHasPet}
              specialRequests={specialRequests}
              setSpecialRequests={setSpecialRequests}
              onContinueClick={handleContinueToConfirm}
            />
          ) : (
            <ReservationConfirmView
              firstName={firstName}
              lastName={lastName}
              email={email}
              phone={phone}
              street={street}
              city={city}
              postalCode={postalCode}
              hasPet={hasPet}
              specialRequests={specialRequests}
              isSubmitting={isSubmitting}
              onBackClick={handleBackToContact}
            />
          )}
        </form>
      </Card>
    </div>
  );
};

export default ContactForm;
