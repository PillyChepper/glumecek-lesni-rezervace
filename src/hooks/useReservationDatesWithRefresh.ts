
import { useState, useEffect, useCallback } from 'react';
import { useReservationDates } from './useReservationDates';

export function useReservationDatesWithRefresh(startDate?: Date, endDate?: Date) {
  const [refreshCounter, setRefreshCounter] = useState(0);
  const { disabledDates, loading, error, isSupabaseConnected } = useReservationDates(startDate, endDate);
  
  // Function to force a refresh of the reservation dates
  const refreshDates = useCallback(() => {
    console.log('Manually refreshing reservation dates');
    setRefreshCounter(prev => prev + 1);
    // Force a page reload to ensure fresh data fetch
    window.location.reload();
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
    isSupabaseConnected,
    refreshDates 
  };
}
