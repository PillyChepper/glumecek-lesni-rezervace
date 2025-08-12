
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { startOfDay } from 'date-fns';
import { logger } from '@/utils/logger';

export function useReservationDates(startDate?: Date, endDate?: Date) {
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  const fetchReservationDates = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check connection first
      const connected = await checkSupabaseConnection();
      
      // If not connected, show error but don't fall back to sample data
      if (!connected) {
        logger.warn('Database connection issues');
        setDisabledDates([]);
        setLoading(false);
        return;
      }

      logger.info('Fetching ALL reservations from the database');
      
      // Try to fetch from Supabase
      try {
        // Filter out ONLY reservations with status 'cancelled'
        // This means both 'pending' and 'confirmed' reservations will block dates
        const { data: reservationsData, error: reservationsError } = await supabase
          .from('reservations')
          .select('arrival_date, departure_date, status')
          .neq('status', 'cancelled');

        if (reservationsError) {
          logger.error('Error fetching reservations:', reservationsError);
          setError('Error fetching reservation data.');
          setDisabledDates([]);
          setLoading(false);
          return;
        }

        logger.debug('Raw reservations data:', reservationsData);

        if (reservationsData && reservationsData.length > 0) {
          // Process the reservations to get all dates between arrival and departure
          const bookedDatesSet = new Set<string>();
          
          reservationsData.forEach(reservation => {
            // Skip cancelled reservations (double check even though we filtered in the query)
            if (reservation.status === 'cancelled') return;
            
            // Parse dates and ensure they're in local time by using new Date()
            const arrivalDate = new Date(reservation.arrival_date);
            const departureDate = new Date(reservation.departure_date);
            
            logger.debug(`Processing reservation: ${arrivalDate.toISOString()} - ${departureDate.toISOString()}`);
            logger.debug(`Arrival date: ${arrivalDate.getDate()}/${arrivalDate.getMonth() + 1}, Departure date: ${departureDate.getDate()}/${departureDate.getMonth() + 1}`);
            
            // Generate all dates FROM arrival TO departure (inclusive of arrival, exclusive of departure)
            // This is the crucial fix - we want to mark dates from arrival date UP TO BUT NOT INCLUDING departure date
            let currentDateCopy = new Date(arrivalDate);
            
            // Use a safe approach to prevent potential infinite loops
            const maxDays = 100; // Safety limit
            let dayCount = 0;
            
            while (currentDateCopy < departureDate && dayCount < maxDays) {
              // Format date without time component
              const dateStr = currentDateCopy.toISOString().split('T')[0];
              bookedDatesSet.add(dateStr);
              logger.debug(`Adding booked date: ${dateStr} (${currentDateCopy.getDate()}/${currentDateCopy.getMonth() + 1})`);
              
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
          
          logger.debug('Processed booked dates:', bookedDates.length, 'dates:', bookedDates);
          setDisabledDates(bookedDates);
        } else {
          logger.info('No booked dates found in database');
          setDisabledDates([]);
        }
      } catch (supabaseErr) {
        logger.error('Supabase query error:', supabaseErr);
        setError('Error fetching reservation data.');
        setDisabledDates([]);
      }
    } catch (err) {
      logger.error('Error fetching reservation dates:', err);
      setError('Failed to load reservation dates.');
      setDisabledDates([]);
    } finally {
      setLoading(false);
    }
  };

  // Check if Supabase is connected properly
  const checkSupabaseConnection = async () => {
    try {
      // Try to query first to confirm the connection
      const { data, error } = await supabase.from('reservations').select('count').limit(1);
      
      if (error) {
        logger.error('Supabase connection check failed:', error);
        setIsSupabaseConnected(false);
        setError('Could not connect to the database. Please try again later.');
        return false;
      }
      
      logger.info('Supabase connection check succeeded');
      setIsSupabaseConnected(true);
      return true;
    } catch (err) {
      logger.error('Unexpected error checking Supabase connection:', err);
      setIsSupabaseConnected(false);
      setError('Could not connect to the database due to an unexpected error.');
      return false;
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchReservationDates();
    
    // Set up periodic connection checks to detect when Supabase comes back online
    const connectionCheckInterval = setInterval(async () => {
      if (!isSupabaseConnected) {
        logger.info('Checking if Supabase is back online...');
        const connected = await checkSupabaseConnection();
        if (connected) {
          logger.info('Supabase is back online! Refreshing reservation dates...');
          fetchReservationDates();
        }
      }
    }, 10000); // Check every 10 seconds when disconnected
    
    // Set up event listener for reservation changes
    const handleReservationChange = () => {
      logger.info('Reservation change detected, refreshing dates');
      fetchReservationDates();
    };
    
    window.addEventListener('reservation-changed', handleReservationChange);
    window.addEventListener('reservation-cancelled', handleReservationChange);
    
    // Clean up event listener and interval
    return () => {
      clearInterval(connectionCheckInterval);
      window.removeEventListener('reservation-changed', handleReservationChange);
      window.removeEventListener('reservation-cancelled', handleReservationChange);
    };
  }, [isSupabaseConnected]);

  return { disabledDates, loading, error, isSupabaseConnected };
}
