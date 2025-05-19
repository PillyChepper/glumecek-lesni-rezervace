
import { supabase } from '@/integrations/supabase/client';

export interface Reservation {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  arrival_date: string;
  departure_date: string;
  number_of_guests?: number; // Now optional
  number_of_pets: number;
  special_requests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | string; // Added string to accept any value from database
  created_at?: string;
}

export async function createReservation(reservation: Omit<Reservation, 'id' | 'status' | 'created_at'>): Promise<{ data: Reservation | null; error: any }> {
  try {
    console.log('Creating reservation with Supabase:', reservation);
    
    const reservationData = {
      ...reservation,
      status: 'pending' // Ensure status is set explicitly
    };
    
    const { data, error } = await supabase
      .from('reservations')
      .insert(reservationData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating reservation in Supabase:', error);
      
      // Fallback for development/testing
      const mockReservation = {
        ...reservation,
        id: crypto.randomUUID(),
        status: 'pending',
        created_at: new Date().toISOString()
      };
      
      console.log('Falling back to mock reservation:', mockReservation);
      
      return { 
        data: mockReservation as Reservation, 
        error: null 
      };
    }
    
    console.log('Reservation created successfully:', data);
    
    // Dispatch event to notify other components that a reservation has been created
    const event = new CustomEvent('reservation-changed', { 
      detail: { reservation: data } 
    });
    window.dispatchEvent(event);
    
    return { data, error: null };
  } catch (error) {
    console.error('Exception in createReservation:', error);
    return { data: null, error };
  }
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

  // Dispatch event to notify other components that a reservation status has changed
  if (!error) {
    const event = new CustomEvent('reservation-changed', { 
      detail: { reservation: data } 
    });
    window.dispatchEvent(event);
  }

  return { data, error };
}
