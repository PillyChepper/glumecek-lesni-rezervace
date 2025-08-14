import { Input } from '@/components/ui/input';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { type ReservationFormData } from '@/schemas/reservationFormSchema';

const PersonalInfoSectionRHF = () => {
  const form = useFormContext<ReservationFormData>();

  return (
    <Card className="border-t-4 border-t-forest-600">
      <CardContent className="pt-6">
        <div className="flex items-center mb-4">
          <User className="h-5 w-5 text-forest-600 mr-2" />
          <CardTitle className="text-lg">Osobní údaje</CardTitle>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jméno *</FormLabel>
                <FormControl>
                  <Input placeholder="Zadejte jméno" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Příjmení *</FormLabel>
                <FormControl>
                  <Input placeholder="Zadejte příjmení" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-2 mb-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center mb-1">
                  <Mail className="h-4 w-4 text-forest-600 mr-2" />
                  <FormLabel>Email *</FormLabel>
                </div>
                <FormControl>
                  <Input type="email" placeholder="Zadejte emailovou adresu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center mb-1">
                  <Phone className="h-4 w-4 text-forest-600 mr-2" />
                  <FormLabel>Telefon *</FormLabel>
                </div>
                <FormControl>
                  <Input 
                    type="tel" 
                    placeholder="Zadejte telefonní číslo" 
                    {...field}
                    onChange={(e) => {
                      // Only allow numbers, spaces, +, -, ( and )
                      const value = e.target.value.replace(/[^0-9+\s\-()]/g, '');
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
      </CardContent>
    </Card>
  );
};

export default PersonalInfoSectionRHF;