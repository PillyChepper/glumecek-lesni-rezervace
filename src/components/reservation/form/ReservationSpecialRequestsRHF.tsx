import { Textarea } from '@/components/ui/textarea';
import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { type ReservationFormData } from '@/schemas/reservationFormSchema';

const ReservationSpecialRequestsRHF = () => {
  const form = useFormContext<ReservationFormData>();

  return (
    <FormField
      control={form.control}
      name="specialRequests"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Zvláštní požadavky</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Máte nějaké zvláštní požadavky nebo přání? Dejte nám vědět."
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ReservationSpecialRequestsRHF;