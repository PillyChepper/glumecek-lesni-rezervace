
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
        
        const { data, error } = await supabase
          .rpc<UnavailableDateResponse>('get_unavailable_dates', {
            start_date: start.toISOString(),
            end_date: end.toISOString()
          });

        if (error) throw error;

        if (data) {
          // Convert the dates from the function to Date objects
          const bookedDates = data.map(row => new Date(row.booked_date));
          setDisabledDates(bookedDates);
        }
      } catch (err) {
        console.error('Error fetching reservation dates:', err);
        setError('Failed to load reservation dates');
      } finally {
        setLoading(false);
      }
    }

    fetchReservationDates();
  }, [startDate, endDate]);

  return { disabledDates, loading, error };
}
