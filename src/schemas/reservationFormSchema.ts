import { z } from 'zod';

export const reservationFormSchema = z.object({
  firstName: z.string().min(1, "Jméno je povinné").trim(),
  lastName: z.string().min(1, "Příjmení je povinné").trim(),
  email: z.string()
    .min(1, "Email je povinný")
    .email("Prosím zadejte platnou emailovou adresu"),
  phone: z.string().min(1, "Telefon je povinný").trim(),
  street: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  hasPet: z.boolean().default(false),
  specialRequests: z.string().optional()
});

export type ReservationFormData = z.infer<typeof reservationFormSchema>;