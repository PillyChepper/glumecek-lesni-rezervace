
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { createReservation } from '@/lib/supabase/reservations';
import { DateRange } from '@/components/DateRangePicker';

export const useReservationForm = (dateRange: DateRange, onSubmit: (e: React.FormEvent) => void) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  // Address fields
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [hasPet, setHasPet] = useState(false);
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) && email.length > 0) {
      setEmailError('Prosím zadejte platnou emailovou adresu');
      return false;
    } else {
      setEmailError(null);
      return true;
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dateRange.from || !dateRange.to) {
      toast({
        title: "Chyba při rezervaci",
        description: "Prosím vyberte datum příjezdu a odjezdu",
        variant: "destructive",
      });
      return;
    }

    if (!firstName || !lastName || !email || !phone) {
      toast({
        title: "Chyba při rezervaci",
        description: "Prosím vyplňte všechny povinné údaje",
        variant: "destructive",
      });
      return;
    }

    // Validate email before submitting
    if (!validateEmail(email)) {
      toast({
        title: "Neplatný email",
        description: "Prosím zadejte platnou emailovou adresu",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await createReservation({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        arrival_date: dateRange.from.toISOString(),
        departure_date: dateRange.to.toISOString(),
        number_of_pets: hasPet ? 1 : 0,
        special_requests: specialRequests,
        // Add address fields directly to the reservation
        street,
        city,
        postal_code: postalCode
      });
      
      if (error) throw error;
      
      toast({
        title: "Rezervace odeslána",
        description: "Vaše rezervace byla úspěšně odeslána. Brzy vás budeme kontaktovat.",
      });
      
      // Call the original onSubmit to maintain existing behavior
      onSubmit(e);
      
      // Reset form
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setStreet('');
      setCity('');
      setPostalCode('');
      setHasPet(false);
      setSpecialRequests('');
      
      // Navigate to homepage after submission
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast({
        title: "Chyba při rezervaci",
        description: "Došlo k chybě při odesílání rezervace. Prosím zkuste to znovu později.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email, 
    setEmail,
    emailError,
    setEmailError,
    validateEmail,
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
    isConfirming,
    setIsConfirming,
    handleFormSubmit
  };
};
