
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with fallback to empty database client if env vars are missing
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if we have the required credentials
if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase URL or key is missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

// Create a mock client for development if credentials are missing
export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : createClient('https://placeholder-url.supabase.co', 'placeholder-key', {
      auth: { persistSession: false },
    });

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
  payment_method: 'bank-transfer' | 'cash';
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at?: string;
}

export async function createReservation(reservation: Omit<Reservation, 'id' | 'status' | 'created_at'>): Promise<{ data: Reservation | null; error: Error | null }> {
  // If no valid supabase connection, return mock success response
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Using mock createReservation response since Supabase is not configured');
    return { 
      data: { 
        ...reservation, 
        id: 'mock-id-' + Date.now(),
        status: 'pending', 
        created_at: new Date().toISOString() 
      } as Reservation, 
      error: null 
    };
  }

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

export async function getReservationsByDateRange(startDate: string, endDate: string) {
  // If no valid supabase connection, return mock empty response
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Using mock getReservationsByDateRange response since Supabase is not configured');
    return { data: [], error: null };
  }

  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .or(`arrival_date.lte.${endDate},departure_date.gte.${startDate}`)
    .not('status', 'eq', 'cancelled');

  return { data, error };
}

export async function getReservationsByEmail(email: string) {
  // If no valid supabase connection, return mock empty response
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Using mock getReservationsByEmail response since Supabase is not configured');
    return { data: [], error: null };
  }

  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('email', email)
    .order('arrival_date', { ascending: true });

  return { data, error };
}

export async function updateReservationStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled') {
  // If no valid supabase connection, return mock success response
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Using mock updateReservationStatus response since Supabase is not configured');
    return { 
      data: { id, status, updated_at: new Date().toISOString() }, 
      error: null 
    };
  }

  const { data, error } = await supabase
    .from('reservations')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  return { data, error };
}
