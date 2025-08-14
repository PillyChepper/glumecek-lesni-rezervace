import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { createReservation } from '@/lib/supabase/reservations';
import { DateRange } from '@/components/DateRangePicker';
import { reservationFormSchema, type ReservationFormData } from '@/schemas/reservationFormSchema';
import { logger } from '@/utils/logger';

export const useReservationFormRHF = (dateRange: DateRange, onSubmit: (e: React.FormEvent) => void) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<ReservationFormData>({
    resolver: zodResolver(reservationFormSchema),
    mode: 'onChange', // Enable validation on change
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      street: '',
      city: '',
      postalCode: '',
      hasPet: false,
      specialRequests: ''
    }
  });

  const handleFormSubmit = async (data: ReservationFormData) => {
    if (!dateRange.from || !dateRange.to) {
      toast({
        title: "Chyba při rezervaci",
        description: "Prosím vyberte datum příjezdu a odjezdu",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await createReservation({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        arrival_date: dateRange.from.toISOString(),
        departure_date: dateRange.to.toISOString(),
        number_of_pets: data.hasPet ? 1 : 0,
        special_requests: data.specialRequests || '',
        street: data.street || '',
        city: data.city || '',
        postal_code: data.postalCode || ''
      });
      
      if (error) throw error;
      
      toast({
        title: "Rezervace odeslána",
        description: "Vaše rezervace byla úspěšně odeslána. Brzy vás budeme kontaktovat.",
      });
      
      // Call the original onSubmit to maintain existing behavior
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      onSubmit(fakeEvent);
      
      // Reset form
      form.reset();
      
      // Navigate to homepage after submission
      navigate('/', { replace: true });
    } catch (error) {
      logger.error('Error creating reservation:', error);
      toast({
        title: "Chyba při rezervaci",
        description: "Došlo k chybě při odesílání rezervace. Prosím zkuste to znovu později.",
        variant: "destructive",
      });
    }
  };

  return {
    form,
    handleFormSubmit
  };
};