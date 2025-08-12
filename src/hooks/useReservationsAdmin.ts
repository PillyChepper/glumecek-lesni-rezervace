
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Reservation, updateReservationStatus } from '@/lib/supabase/reservations';
import { logger } from '@/utils/logger';

export function useReservationsAdmin() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<{id: string, action: 'confirm' | 'cancel' | 'cancel-confirmed'} | null>(null);
  const { toast } = useToast();

  const fetchReservations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      logger.info('Fetching reservations...');
      
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('arrival_date', { ascending: false }); // Changed to descending order (newest dates at top)
      
      if (error) {
        logger.error('Error fetching reservations:', error);
        throw error;
      }
      
      logger.info('Fetched reservations:', data?.length || 0, data);
      setReservations(data || []);
    } catch (err) {
      logger.error('Error fetching reservations:', err);
      setError('Nepodařilo se načíst rezervace');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleStatusUpdate = async () => {
    if (!selectedReservation) return;
    
    try {
      const { id, action } = selectedReservation;
      // Both 'cancel' and 'cancel-confirmed' actions will set status to 'cancelled'
      const newStatus = action === 'confirm' ? 'confirmed' : 'cancelled';
      
      const { data, error } = await updateReservationStatus(id, newStatus);
      
      if (error) throw error;
      
      // Update the local state
      setReservations(prev => 
        prev.map(res => res.id === id ? { ...res, status: newStatus } : res)
      );
      
      // If we're cancelling a reservation, broadcast an event that the calendar
      // data needs to be refreshed (dates have been freed up)
      if (action === 'cancel' || action === 'cancel-confirmed') {
        // The event will be picked up by any component subscribing to it
        const event = new CustomEvent('reservation-cancelled', { 
          detail: { reservationId: id } 
        });
        window.dispatchEvent(event);
      }
      
      let toastTitle = "";
      let toastDescription = "";
      
      if (action === 'confirm') {
        toastTitle = "Rezervace potvrzena";
        toastDescription = "Rezervace byla úspěšně potvrzena.";
      } else if (action === 'cancel') {
        toastTitle = "Rezervace zamítnuta";
        toastDescription = "Rezervace byla úspěšně zamítnuta.";
      } else if (action === 'cancel-confirmed') {
        toastTitle = "Rezervace zrušena";
        toastDescription = "Potvrzená rezervace byla úspěšně zrušena.";
      }
      
      toast({
        title: toastTitle,
        description: toastDescription,
        variant: action === 'confirm' ? "default" : "destructive",
      });
    } catch (err) {
      logger.error('Error updating reservation status:', err);
      toast({
        title: "Chyba",
        description: "Nepodařilo se aktualizovat stav rezervace.",
        variant: "destructive",
      });
    } finally {
      setSelectedReservation(null);
      setConfirmDialogOpen(false);
    }
  };

  const openConfirmDialog = (id: string, action: 'confirm' | 'cancel' | 'cancel-confirmed') => {
    setSelectedReservation({ id, action });
    setConfirmDialogOpen(true);
  };

  useEffect(() => {
    // Initial fetch
    fetchReservations();
    
    // Subscribe to changes in the reservations table
    const channel = supabase
      .channel('public:reservations')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'reservations' 
        }, 
        (payload) => {
          logger.debug('Reservation changed via realtime:', payload);
          // Refresh the data when a change is detected
          fetchReservations();
        }
      )
      .subscribe((status) => {
        logger.debug('Realtime subscription status:', status);
      });
      
    // Listen for reservation-changed events from other components
    const handleReservationChange = () => {
      logger.info('Reservation change event received, refreshing...');
      fetchReservations();
    };
    
    window.addEventListener('reservation-changed', handleReservationChange);
    window.addEventListener('reservation-cancelled', handleReservationChange);
    
    // Clean up the subscription and event listeners
    return () => {
      logger.debug('Cleaning up Admin component subscriptions');
      supabase.removeChannel(channel);
      window.removeEventListener('reservation-changed', handleReservationChange);
      window.removeEventListener('reservation-cancelled', handleReservationChange);
    };
  }, [fetchReservations]);

  return {
    reservations,
    loading,
    error,
    confirmDialogOpen,
    setConfirmDialogOpen,
    selectedReservation,
    handleStatusUpdate,
    openConfirmDialog,
    fetchReservations
  };
}
