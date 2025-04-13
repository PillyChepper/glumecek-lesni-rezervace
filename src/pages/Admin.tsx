
import { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarTrigger,
  SidebarInset
} from "@/components/ui/sidebar";
import { Calendar, Home, Users, Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Reservation, updateReservationStatus } from "@/lib/supabase/reservations";
import { Spinner } from "@/components/ui/spinner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<{id: string, action: 'confirm' | 'cancel'} | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchReservations();
  }, []);

  async function fetchReservations() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('arrival_date', { ascending: true });
      
      if (error) throw error;
      
      setReservations(data || []);
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setError('Nepodařilo se načíst rezervace');
    } finally {
      setLoading(false);
    }
  }

  const handleStatusUpdate = async () => {
    if (!selectedReservation) return;
    
    try {
      const { id, action } = selectedReservation;
      const newStatus = action === 'confirm' ? 'confirmed' : 'cancelled';
      
      const { data, error } = await updateReservationStatus(id, newStatus);
      
      if (error) throw error;
      
      // Update the local state
      setReservations(prev => 
        prev.map(res => res.id === id ? { ...res, status: newStatus } : res)
      );
      
      toast({
        title: action === 'confirm' ? "Rezervace potvrzena" : "Rezervace zamítnuta",
        description: `Rezervace byla úspěšně ${action === 'confirm' ? 'potvrzena' : 'zamítnuta'}.`,
        variant: action === 'confirm' ? "default" : "destructive",
      });
    } catch (err) {
      console.error('Error updating reservation status:', err);
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

  const openConfirmDialog = (id: string, action: 'confirm' | 'cancel') => {
    setSelectedReservation({ id, action });
    setConfirmDialogOpen(true);
  };

  const getStatusColor = (status: Reservation['status']) => {
    switch(status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "";
    }
  };

  const getStatusText = (status: Reservation['status']) => {
    switch(status) {
      case "confirmed": return "Potvrzeno";
      case "pending": return "Čeká na potvrzení";
      case "cancelled": return "Zrušeno";
      default: return status;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <SidebarInset className="px-4 py-6 md:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="section-title">Rezervace</h1>
            <SidebarTrigger />
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner className="h-8 w-8 text-forest-600" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 p-4">{error}</div>
          ) : (
            <Table>
              <TableCaption>Seznam všech rezervací</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Jméno</TableHead>
                  <TableHead>Kontakt</TableHead>
                  <TableHead>Datum pobytu</TableHead>
                  <TableHead>Osoby</TableHead>
                  <TableHead>Vytvořeno</TableHead>
                  <TableHead>Stav</TableHead>
                  <TableHead>Akce</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Zatím nejsou žádné rezervace
                    </TableCell>
                  </TableRow>
                ) : (
                  reservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-medium">
                        {reservation.first_name} {reservation.last_name}
                      </TableCell>
                      <TableCell>
                        <div>{reservation.email}</div>
                        <div className="text-sm text-muted-foreground">{reservation.phone}</div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(reservation.arrival_date), "d. MMMM", { locale: cs })} - {format(new Date(reservation.departure_date), "d. MMMM yyyy", { locale: cs })}
                      </TableCell>
                      <TableCell>{reservation.number_of_guests}</TableCell>
                      <TableCell>
                        {reservation.created_at && format(new Date(reservation.created_at), "d.M.yyyy", { locale: cs })}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                          {getStatusText(reservation.status)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {reservation.status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="flex items-center text-green-600 border-green-600 hover:bg-green-50"
                                onClick={() => openConfirmDialog(reservation.id!, 'confirm')}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Potvrdit
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="flex items-center text-red-600 border-red-600 hover:bg-red-50"
                                onClick={() => openConfirmDialog(reservation.id!, 'cancel')}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Zamítnout
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}

          {/* Confirmation Dialog */}
          <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {selectedReservation?.action === 'confirm' 
                    ? 'Potvrdit rezervaci' 
                    : 'Zamítnout rezervaci'}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {selectedReservation?.action === 'confirm'
                    ? 'Opravdu chcete potvrdit tuto rezervaci? Klient bude informován o potvrzení.'
                    : 'Opravdu chcete zamítnout tuto rezervaci? Klient bude informován o zamítnutí.'}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Zrušit</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleStatusUpdate}
                  className={selectedReservation?.action === 'confirm' 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'}
                >
                  {selectedReservation?.action === 'confirm' ? 'Potvrdit' : 'Zamítnout'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

const AdminSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="px-2 py-2">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/">
                    <Home />
                    <span>Přejít na web</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive>
                  <Link to="/admin">
                    <Calendar />
                    <span>Rezervace</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/admin/clients">
                    <Users />
                    <span>Klienti</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default Admin;
