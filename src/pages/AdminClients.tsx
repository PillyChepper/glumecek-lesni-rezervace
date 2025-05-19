
import { useQuery } from "@tanstack/react-query";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";

type Client = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  reservation_count: number;
  last_reservation: string;
  has_pet: boolean;
  created_at: string; // Add created_at to the Client type
};

const AdminClients = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: clients, isLoading, error, refetch } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reservations")
        .select("first_name, last_name, email, phone, number_of_pets, created_at") // Include created_at in the select
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Process the data to get unique clients with their reservation counts
      const clientMap = new Map<string, Client>();
      
      data.forEach((reservation) => {
        const email = reservation.email;
        const hasPet = reservation.number_of_pets > 0;
        
        if (clientMap.has(email)) {
          // Update existing client
          const client = clientMap.get(email)!;
          client.reservation_count += 1;
          // Only update last_reservation if this one is newer
          if (new Date(reservation.created_at) > new Date(client.last_reservation)) {
            client.last_reservation = reservation.created_at;
          }
          // If any reservation has a pet, mark the client as having pets
          if (hasPet) {
            client.has_pet = true;
          }
        } else {
          // Add new client
          clientMap.set(email, {
            first_name: reservation.first_name,
            last_name: reservation.last_name,
            email: reservation.email,
            phone: reservation.phone,
            reservation_count: 1,
            last_reservation: reservation.created_at,
            has_pet: hasPet,
            created_at: reservation.created_at // Include created_at in the new client object
          });
        }
      });
      
      return Array.from(clientMap.values());
    },
  });

  // Filter clients based on search term
  const filteredClients = clients?.filter(client => {
    const searchLower = searchTerm.toLowerCase();
    return (
      client.first_name.toLowerCase().includes(searchLower) ||
      client.last_name.toLowerCase().includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower) ||
      client.phone.includes(searchTerm)
    );
  });

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <SidebarInset className="px-4 py-6 md:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="section-title">Klienti</h1>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => refetch()}
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-4 w-4" />
                Obnovit
              </Button>
              <SidebarTrigger />
            </div>
          </div>
          
          {/* Search input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Hledat klienty..."
              className="w-full px-4 py-2 border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="text-center py-8">Načítání klientů...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              Chyba při načítání klientů: {(error as Error).message}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Jméno</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefon</TableHead>
                    <TableHead>Počet rezervací</TableHead>
                    <TableHead>Pejsek</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients && filteredClients.length > 0 ? (
                    filteredClients.map((client) => (
                      <TableRow key={client.email}>
                        <TableCell>
                          {client.first_name} {client.last_name}
                        </TableCell>
                        <TableCell>{client.email}</TableCell>
                        <TableCell>{client.phone}</TableCell>
                        <TableCell>{client.reservation_count}</TableCell>
                        <TableCell>{client.has_pet ? "Ano" : "Ne"}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        {searchTerm ? "Žádní klienti nenalezeni" : "Zatím žádní klienti"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminClients;
