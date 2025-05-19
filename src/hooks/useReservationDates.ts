
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { startOfDay } from 'date-fns';
import { getBookedDates } from '@/utils/bookedDates';

// Define the interface for the data returned by the RPC function
interface UnavailableDateResponse {
  booked_date: string;
}

export function useReservationDates(startDate?: Date, endDate?: Date) {
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  useEffect(() => {
    // Check if Supabase is connected properly
    const checkSupabaseConnection = async () => {
      try {
        // Try to query first to confirm the connection and check if RLS is off
        const { data, error } = await supabase.from('reservations').select('count').limit(1);
        
        if (error) {
          console.error('Supabase connection check failed:', error);
          setIsSupabaseConnected(false);
          setError('Could not connect to the database. Using sample booked dates.');
          return false;
        }
        
        console.log('Supabase connection check succeeded - RLS seems to be disabled');
        setIsSupabaseConnected(true);
        return true;
      } catch (err) {
        console.error('Unexpected error checking Supabase connection:', err);
        setIsSupabaseConnected(false);
        setError('Could not connect to the database due to an unexpected error. Using sample booked dates.');
        return false;
      }
    };

    async function fetchReservationDates() {
      setLoading(true);
      setError(null);

      try {
        // Check connection first
        const connected = await checkSupabaseConnection();
        
        // If not connected or we get errors, use sample data
        if (!connected) {
          console.log('Using sample booked dates due to connection issues');
          const sampleDates = getBookedDates();
          console.log('Sample booked dates:', sampleDates);
          setDisabledDates(sampleDates);
          setLoading(false);
          return;
        }

        console.log('Fetching ALL reservations from the database');
        
        // Try to fetch from Supabase - FETCH ALL RESERVATIONS, not just within a date range
        try {
          // Filter out reservations with status 'cancelled'
          const { data: reservationsData, error: reservationsError } = await supabase
            .from('reservations')
            .select('arrival_date, departure_date, status')
            .neq('status', 'cancelled'); // Only exclude cancelled reservations

          if (reservationsError) {
            console.error('Error fetching reservations:', reservationsError);
            throw reservationsError;
          }

          console.log('Raw reservations data:', reservationsData);

          if (reservationsData && reservationsData.length > 0) {
            // Process the reservations to get all dates between arrival and departure
            const bookedDatesSet = new Set<string>();
            
            reservationsData.forEach(reservation => {
              // Skip cancelled reservations (double check even though we filtered in the query)
              if (reservation.status === 'cancelled') return;
              
              // Ensure proper date parsing
              const arrivalDate = new Date(reservation.arrival_date);
              const departureDate = new Date(reservation.departure_date);
              
              console.log(`Processing reservation: ${arrivalDate.toISOString()} - ${departureDate.toISOString()}`);
              
              // Generate all dates between arrival and departure (inclusive)
              const currentDate = new Date(arrivalDate);
              
              // Use a while loop with a date copy to prevent infinite loops
              while (currentDate.getTime() <= departureDate.getTime()) {
                // Add date string with proper formatting
                const dateStr = currentDate.toISOString().split('T')[0];
                bookedDatesSet.add(dateStr);
                
                // Increment day safely
                currentDate.setDate(currentDate.getDate() + 1);
              }
            });
            
            // Convert to Date objects with normalized time (start of day)
            const bookedDates = Array.from(bookedDatesSet).map(dateStr => {
              return startOfDay(new Date(dateStr));
            });
            
            console.log('Processed booked dates:', bookedDates.length, 'dates');
            setDisabledDates(bookedDates);
          } else {
            console.log('No booked dates found in database, using sample data');
            const sampleDates = getBookedDates();
            setDisabledDates(sampleDates);
          }
        } catch (supabaseErr) {
          console.error('Supabase query error:', supabaseErr);
          
          // Fallback to sample data
          const sampleDates = getBookedDates();
          setDisabledDates(sampleDates);
          console.log('Using sample data for booked dates');
          setError('Error fetching reservation data. Using sample booked dates for display.');
        }
      } catch (err) {
        console.error('Error fetching reservation dates:', err);
        setError('Failed to load reservation dates. Using sample dates.');
        const sampleDates = getBookedDates();
        setDisabledDates(sampleDates);
      } finally {
        setLoading(false);
      }
    }

    fetchReservationDates();
  }, [startDate, endDate]);

  return { disabledDates, loading, error, isSupabaseConnected };
}
