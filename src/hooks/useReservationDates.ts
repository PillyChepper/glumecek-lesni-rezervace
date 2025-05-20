
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { startOfDay } from 'date-fns';

export function useReservationDates(startDate?: Date, endDate?: Date) {
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  useEffect(() => {
    // Check if Supabase is connected properly
    const checkSupabaseConnection = async () => {
      try {
        // Try to query first to confirm the connection
        const { data, error } = await supabase.from('reservations').select('count').limit(1);
        
        if (error) {
          console.error('Supabase connection check failed:', error);
          setIsSupabaseConnected(false);
          setError('Could not connect to the database. Please try again later.');
          return false;
        }
        
        console.log('Supabase connection check succeeded');
        setIsSupabaseConnected(true);
        return true;
      } catch (err) {
        console.error('Unexpected error checking Supabase connection:', err);
        setIsSupabaseConnected(false);
        setError('Could not connect to the database due to an unexpected error.');
        return false;
      }
    };

    async function fetchReservationDates() {
      setLoading(true);
      setError(null);

      try {
        // Check connection first
        const connected = await checkSupabaseConnection();
        
        // If not connected, show error but don't fall back to sample data
        if (!connected) {
          console.log('Database connection issues');
          setDisabledDates([]);
          setLoading(false);
          return;
        }

        console.log('Fetching ALL reservations from the database');
        
        // Try to fetch from Supabase
        try {
          // Filter out ONLY reservations with status 'cancelled'
          // This means both 'pending' and 'confirmed' reservations will block dates
          const { data: reservationsData, error: reservationsError } = await supabase
            .from('reservations')
            .select('arrival_date, departure_date, status')
            .neq('status', 'cancelled'); // Using .neq instead of .not() to get all except 'cancelled'

          if (reservationsError) {
            console.error('Error fetching reservations:', reservationsError);
            setError('Error fetching reservation data.');
            setDisabledDates([]);
            setLoading(false);
            return;
          }

          console.log('Raw reservations data:', reservationsData);

          if (reservationsData && reservationsData.length > 0) {
            // Process the reservations to get all dates between arrival and departure
            const bookedDatesSet = new Set<string>();
            
            reservationsData.forEach(reservation => {
              // Skip cancelled reservations (double check even though we filtered in the query)
              if (reservation.status === 'cancelled') return;
              
              // Parse the dates properly
              const arrivalDate = new Date(reservation.arrival_date);
              const departureDate = new Date(reservation.departure_date);
              
              console.log(`Processing reservation: ${arrivalDate.toISOString()} - ${departureDate.toISOString()}`);
              
              // Generate all dates between arrival and departure (inclusive of both dates)
              let currentDateCopy = new Date(arrivalDate);
              
              // Use a safe approach to prevent potential infinite loops
              const maxDays = 100; // Safety limit
              let dayCount = 0;
              
              // Include all dates from arrival through departure
              while ((currentDateCopy.getTime() <= departureDate.getTime()) && dayCount < maxDays) {
                // Format date without time component for consistency
                const dateStr = currentDateCopy.toISOString().split('T')[0];
                bookedDatesSet.add(dateStr);
                console.log(`Adding booked date: ${dateStr}`);
                
                // Create a new date object for the next day to avoid reference issues
                const nextDay = new Date(currentDateCopy);
                nextDay.setDate(nextDay.getDate() + 1);
                currentDateCopy = nextDay;
                
                dayCount++;
              }
            });
            
            // Convert string dates to Date objects
            const bookedDates = Array.from(bookedDatesSet).map(dateStr => {
              return startOfDay(new Date(dateStr));
            });
            
            console.log('Processed booked dates:', bookedDates.length, 'dates:', bookedDates);
            setDisabledDates(bookedDates);
          } else {
            console.log('No booked dates found in database');
            setDisabledDates([]);
          }
        } catch (supabaseErr) {
          console.error('Supabase query error:', supabaseErr);
          setError('Error fetching reservation data.');
          setDisabledDates([]);
        }
      } catch (err) {
        console.error('Error fetching reservation dates:', err);
        setError('Failed to load reservation dates.');
        setDisabledDates([]);
      } finally {
        setLoading(false);
      }
    }

    fetchReservationDates();
    
    // Set up event listener for reservation changes
    const handleReservationChange = () => {
      console.log('Reservation change detected, refreshing dates');
      fetchReservationDates();
    };
    
    window.addEventListener('reservation-changed', handleReservationChange);
    window.addEventListener('reservation-cancelled', handleReservationChange);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('reservation-changed', handleReservationChange);
      window.removeEventListener('reservation-cancelled', handleReservationChange);
    };
  }, []);

  return { disabledDates, loading, error, isSupabaseConnected };
}
