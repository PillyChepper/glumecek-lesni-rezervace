import { Checkbox } from '@/components/ui/checkbox';
import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { type ReservationFormData } from '@/schemas/reservationFormSchema';

const ReservationGuestOptionsRHF = () => {
  const form = useFormContext<ReservationFormData>();

  return (
    <FormField
      control={form.control}
      name="hasPet"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
          <FormControl>
            <Checkbox 
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className="cursor-pointer">
              Přijedu s pejskem
            </FormLabel>
          </div>
        </FormItem>
      )}
    />
  );
};

export default ReservationGuestOptionsRHF;