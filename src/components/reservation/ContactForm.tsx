
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRange } from '@/components/DateRangePicker';
import ReservationContactInfo from './form/ReservationContactInfo';
import ReservationGuestOptions from './form/ReservationGuestOptions';
import ReservationSpecialRequests from './form/ReservationSpecialRequests';
import ReservationPaymentInfo from './form/ReservationPaymentInfo';
import ReservationFormSubmitButton from './form/ReservationFormSubmitButton';
import { useReservationForm } from './form/useReservationForm';
import { BookingStep } from './BookingSteps';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowRight } from 'lucide-react';

interface ContactFormProps {
  dateRange: DateRange;
  onSubmit: (e: React.FormEvent) => void;
}

const ContactForm = ({ dateRange, onSubmit }: ContactFormProps) => {
  const [currentStep, setCurrentStep] = useState<'contact' | 'confirm'>('contact');
  
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
  
  const handleBackToContact = () => {
    setCurrentStep('contact');
  };

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-display font-medium mb-4 text-forest-700">
        {currentStep === 'contact' ? 'Vyplňte své údaje' : 'Potvrzení rezervace'}
      </h2>
      
      <Card>
        <form onSubmit={handleFormSubmit}>
          {currentStep === 'contact' ? (
            <>
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
                  street={street}
                  setStreet={setStreet}
                  city={city}
                  setCity={setCity}
                  postalCode={postalCode}
                  setPostalCode={setPostalCode}
                />
                
                <ReservationGuestOptions 
                  hasPet={hasPet}
                  setHasPet={setHasPet}
                />
                
                <ReservationSpecialRequests 
                  specialRequests={specialRequests}
                  setSpecialRequests={setSpecialRequests}
                />
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-[#4a544a] hover:bg-[#3d443d] text-white"
                  onClick={handleContinueToConfirm}
                  disabled={!firstName || !lastName || !email || !phone}
                >
                  <ArrowRight className="h-4 w-4 mr-1" />
                  Pokračovat k potvrzení
                </Button>
              </CardFooter>
            </>
          ) : (
            <>
              <CardHeader>
                <CardTitle>Potvrzení rezervace</CardTitle>
                <CardDescription>Zkontrolujte prosím zadané údaje před odesláním rezervace</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={handleBackToContact}
                  className="w-full sm:w-auto"
                >
                  Zpět k údajům
                </Button>
                <ReservationFormSubmitButton isSubmitting={isSubmitting} />
              </CardFooter>
            </>
          )}
        </form>
      </Card>
    </div>
  );
};

export default ContactForm;
