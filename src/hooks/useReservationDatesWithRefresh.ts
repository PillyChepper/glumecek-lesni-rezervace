
import { useState, useEffect, useCallback } from 'react';
import { useReservationDates } from './useReservationDates';

export function useReservationDatesWithRefresh(startDate?: Date, endDate?: Date) {
  const { disabledDates, loading, error } = useReservationDates(startDate, endDate);
  const [refreshCounter, setRefreshCounter] = useState(0);
  
  // Function to force a refresh of the reservation dates
  const refreshDates = useCallback(() => {
    setRefreshCounter(prev => prev + 1);
  }, []);
  
  // Listen for reservation-cancelled events
  useEffect(() => {
    const handleReservationCancelled = () => {
      console.log('Reservation cancelled, refreshing calendar dates');
      refreshDates();
    };
    
    // Add event listener
    window.addEventListener('reservation-cancelled', handleReservationCancelled);
    
    // Clean up
    return () => {
      window.removeEventListener('reservation-cancelled', handleReservationCancelled);
    };
  }, [refreshDates]);
  
  return { 
    disabledDates, 
    loading, 
    error,
    refreshDates 
  };
}
