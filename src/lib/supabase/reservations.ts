
import { supabase } from '@/integrations/supabase/client';

export interface Reservation {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  arrival_date: string;
  departure_date: string;
  number_of_guests: number;
  number_of_pets: number;
  special_requests?: string;
  payment_method: string; // Change from union type to string to match database
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at?: string;
}

export async function createReservation(reservation: Omit<Reservation, 'id' | 'status' | 'created_at'>): Promise<{ data: Reservation | null; error: any }> {
  const { data, error } = await supabase
    .from('reservations')
    .insert({
      ...reservation,
      status: 'pending',
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  return { data, error };
}

export async function getReservationsByDateRange(startDate: string, endDate: string): Promise<{ data: Reservation[] | null; error: any }> {
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .or(`arrival_date.lte.${endDate},departure_date.gte.${startDate}`)
    .not('status', 'eq', 'cancelled');

  return { data, error };
}

export async function getReservationsByEmail(email: string): Promise<{ data: Reservation[] | null; error: any }> {
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('email', email)
    .order('arrival_date', { ascending: true });

  return { data, error };
}

export async function updateReservationStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled'): Promise<{ data: Reservation | null; error: any }> {
  const { data, error } = await supabase
    .from('reservations')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  return { data, error };
}
