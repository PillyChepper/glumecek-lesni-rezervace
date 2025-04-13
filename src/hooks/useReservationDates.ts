
import { useState, useEffect } from 'react';
import { getReservationsByDateRange } from '@/lib/supabase/reservations';

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
        
        const { data, error } = await getReservationsByDateRange(
          start.toISOString(),
          end.toISOString()
        );

        if (error) throw error;

        if (data && data.length > 0) {
          // Process reservations to get all dates that are booked
          const bookedDates: Date[] = [];
          
          data.forEach((reservation) => {
            const arrival = new Date(reservation.arrival_date);
            const departure = new Date(reservation.departure_date);
            
            // Add all dates between arrival and departure
            const currentDate = new Date(arrival);
            
            while (currentDate <= departure) {
              bookedDates.push(new Date(currentDate));
              currentDate.setDate(currentDate.getDate() + 1);
            }
          });
          
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
