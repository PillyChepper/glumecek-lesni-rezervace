
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { DateRange } from '@/components/DateRangePicker';
import { useReservationFormRHF } from './form/useReservationFormRHF';
import BookingSteps, { BookingStep } from './BookingSteps';
import ReservationContactViewRHF from './form/ReservationContactViewRHF';
import ReservationConfirmViewRHF from './form/ReservationConfirmViewRHF';
import { Form } from '@/components/ui/form';

interface ContactFormProps {
  dateRange: DateRange;
  onSubmit: (e: React.FormEvent) => void;
}

const ContactForm = ({ dateRange, onSubmit }: ContactFormProps) => {
  const [currentStep, setCurrentStep] = useState<BookingStep>('contact');
  
  const { form, handleFormSubmit } = useReservationFormRHF(dateRange, onSubmit);

  const handleContinueToConfirm = () => {
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)}>
            {currentStep === 'contact' ? (
              <ReservationContactViewRHF 
                onContinueClick={handleContinueToConfirm}
              />
            ) : (
              <ReservationConfirmViewRHF
                isSubmitting={form.formState.isSubmitting}
                onBackClick={handleBackToContact}
              />
            )}
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default ContactForm;
