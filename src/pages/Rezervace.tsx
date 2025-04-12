
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ReservationCalendar, { BookingDate } from '@/components/Calendar';

const formSchema = z.object({
  firstName: z.string().min(2, { message: 'Jméno musí mít alespoň 2 znaky' }),
  lastName: z.string().min(2, { message: 'Příjmení musí mít alespoň 2 znaky' }),
  email: z.string().email({ message: 'Zadejte platný email' }),
  phone: z.string().min(9, { message: 'Zadejte platné telefonní číslo' }),
  adults: z.string().transform(val => parseInt(val)),
  children: z.string().transform(val => parseInt(val)),
  pets: z.boolean().default(false),
  message: z.string().optional(),
  terms: z.boolean().refine(val => val === true, {
    message: 'Musíte souhlasit s obchodními podmínkami',
  }),
});

type FormValues = z.infer<typeof formSchema>;

const Rezervace = () => {
  const [booking, setBooking] = useState<BookingDate | null>(null);
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      adults: '2',
      children: '0',
      pets: false,
      message: '',
      terms: false,
    },
  });

  const handleBookingComplete = (dates: BookingDate) => {
    setBooking(dates);
    setStep(2);
  };

  const onSubmit = (data: FormValues) => {
    if (!booking?.from || !booking?.to) {
      toast({
        title: 'Chyba při rezervaci',
        description: 'Prosím vyberte datum příjezdu a odjezdu',
        variant: 'destructive',
      });
      return;
    }

    // In a real application, you would send the booking and form data to a server here
    console.log('Booking data:', {
      ...data,
      from: booking.from,
      to: booking.to,
    });

    // Show success message
    toast({
      title: 'Rezervace byla úspěšně dokončena',
      description: 'Děkujeme za vaši rezervaci. Brzy vás budeme kontaktovat.',
    });

    // Redirect to home page after a delay
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 md:pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-forest-700 hover:text-forest-600">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zpět na hlavní stránku
            </Link>
            <h1 className="text-3xl md:text-4xl font-display font-medium mt-4">Rezervace pobytu</h1>
            <p className="text-muted-foreground">Vyplňte formulář pro rezervaci vašeho pobytu v Glumečku</p>
          </div>
          
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-3">
              {step === 1 ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-medium mb-4">1. Vyberte termín pobytu</h2>
                  <ReservationCalendar 
                    disabledDates={[
                      new Date(2025, 3, 15),
                      new Date(2025, 3, 16),
                      new Date(2025, 3, 17),
                      new Date(2025, 3, 18),
                    ]}
                    onBookingComplete={handleBookingComplete}
                  />
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-medium mb-4">2. Vyplňte své údaje</h2>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Jméno</FormLabel>
                              <FormControl>
                                <Input placeholder="Jan" {...field} />
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
                              <FormLabel>Příjmení</FormLabel>
                              <FormControl>
                                <Input placeholder="Novák" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="jan.novak@example.com" type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Telefon</FormLabel>
                              <FormControl>
                                <Input placeholder="+420 123 456 789" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="adults"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Dospělí</FormLabel>
                              <FormControl>
                                <Input type="number" min="1" max="4" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="children"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Děti</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" max="3" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="pets"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-end space-x-2 space-y-0 mt-8">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal cursor-pointer">
                                S domácím mazlíčkem
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Poznámky k rezervaci</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Máte nějaké speciální požadavky nebo dotazy?"
                                className="min-h-[100px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="terms"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm font-normal cursor-pointer">
                                Souhlasím s <a href="#" className="text-forest-700 hover:underline">obchodními podmínkami</a> a <a href="#" className="text-forest-700 hover:underline">zpracováním osobních údajů</a>
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-between items-center pt-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setStep(1)}
                        >
                          Zpět k výběru termínu
                        </Button>
                        <Button 
                          type="submit" 
                          className="bg-forest-600 hover:bg-forest-700"
                        >
                          Odeslat rezervaci
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              )}
            </div>
            
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-28">
                <h2 className="text-xl font-medium mb-4">Rekapitulace rezervace</h2>
                
                {booking?.from && booking?.to ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Datum pobytu</h3>
                      <p>
                        {format(booking.from, 'EEEE d. MMMM yyyy', { locale: cs })} - {format(booking.to, 'EEEE d. MMMM yyyy', { locale: cs })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {Math.ceil(Math.abs(booking.to.getTime() - booking.from.getTime()) / (1000 * 60 * 60 * 24))} nocí
                      </p>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="font-medium">Celková cena</h3>
                      <p className="text-2xl font-medium text-forest-700">
                        {Math.ceil(Math.abs(booking.to.getTime() - booking.from.getTime()) / (1000 * 60 * 60 * 24)) * 2500} Kč
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Včetně ubytování, závěrečného úklidu a DPH
                      </p>
                    </div>
                    
                    <div className="pt-4 border-t text-sm text-muted-foreground">
                      <h3 className="font-medium text-forest-900">Podmínky rezervace</h3>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Check-in: 14:00 - 18:00</li>
                        <li>Check-out: do 11:00</li>
                        <li>Při rezervaci je vyžadována záloha 50%</li>
                        <li>Doplatek je splatný 7 dní před příjezdem</li>
                        <li>Zrušení do 30 dnů před příjezdem - vrácení zálohy</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Vyberte termín pobytu pro zobrazení ceny a detailů rezervace.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Rezervace;
