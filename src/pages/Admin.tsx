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
import { Calendar, Home, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Reservation, getReservationsByDateRange } from "@/lib/supabase/reservations";
import { Spinner } from "@/components/ui/spinner";

const Admin = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReservations() {
      try {
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

    fetchReservations();
  }, []);

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
            <h1 className="text-2xl font-bold">Rezervace</h1>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
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
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
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
