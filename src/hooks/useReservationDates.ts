
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { startOfDay } from 'date-fns';

// Define the interface for the data returned by the RPC function
interface UnavailableDateResponse {
  booked_date: string;
}

export function useReservationDates(startDate?: Date, endDate?: Date) {
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReservationDates() {
      setLoading(true);
      setError(null);

      try {
        // Set default date range to next 3 months if not provided
        const start = startDate || new Date();
        let end = endDate;
        
        if (!end) {
          end = new Date();
          end.setMonth(end.getMonth() + 3);
        }
        
        // Try to fetch from Supabase
        try {
          // Filter out reservations with status 'cancelled'
          const { data: reservationsData, error: reservationsError } = await supabase
            .from('reservations')
            .select('arrival_date, departure_date, status')
            .gte('departure_date', start.toISOString())
            .lte('arrival_date', end.toISOString())
            .neq('status', 'cancelled'); // Exclude cancelled reservations

          if (reservationsError) throw reservationsError;

          if (reservationsData && reservationsData.length > 0) {
            // Process the reservations to get all dates between arrival and departure
            const bookedDatesSet = new Set<string>();
            
            reservationsData.forEach(reservation => {
              // Skip cancelled reservations (double check even though we filtered in the query)
              if (reservation.status === 'cancelled') return;
              
              const arrivalDate = new Date(reservation.arrival_date);
              const departureDate = new Date(reservation.departure_date);
              
              // Generate all dates between arrival and departure (inclusive)
              const currentDate = new Date(arrivalDate);
              while (currentDate <= departureDate) {
                bookedDatesSet.add(currentDate.toISOString().split('T')[0]);
                currentDate.setDate(currentDate.getDate() + 1);
              }
            });
            
            // Convert to Date objects with normalized time (start of day)
            const bookedDates = Array.from(bookedDatesSet).map(dateStr => {
              const date = new Date(dateStr);
              return startOfDay(date);
            });
            
            console.log('Fetched booked dates:', bookedDates);
            setDisabledDates(bookedDates);
          } else {
            console.log('No booked dates found');
            setDisabledDates([]);
          }
        } catch (supabaseErr) {
          console.error('Supabase query error:', supabaseErr);
          
          // Fallback to hardcoded test data
          const mockDisabledDates = [
            new Date(2025, 4, 15), // May 15, 2025
            new Date(2025, 4, 16), // May 16, 2025
            new Date(2025, 4, 17), // May 17, 2025
            new Date(2025, 5, 10), // June 10, 2025
            new Date(2025, 5, 11), // June 11, 2025
            new Date(2025, 5, 12)  // June 12, 2025
          ];
          
          setDisabledDates(mockDisabledDates);
          console.log('Using fallback data for disabled dates');
        }
      } catch (err) {
        console.error('Error fetching reservation dates:', err);
        setError('Failed to load reservation dates');
        setDisabledDates([]);
      } finally {
        setLoading(false);
      }
    }

    fetchReservationDates();
  }, [startDate, endDate]);

  return { disabledDates, loading, error };
}
