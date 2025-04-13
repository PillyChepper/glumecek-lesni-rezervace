
import { useState } from "react";
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

// Mock reservation data - would typically come from a database
const mockReservations = [
  {
    id: "1",
    name: "Jan Novák",
    email: "jan.novak@example.com",
    phone: "+420 123 456 789",
    startDate: new Date(2025, 5, 15),
    endDate: new Date(2025, 5, 20),
    people: 2,
    created: new Date(2025, 4, 10),
    status: "confirmed"
  },
  {
    id: "2",
    name: "Eva Svobodová",
    email: "eva.svobodova@example.com",
    phone: "+420 987 654 321",
    startDate: new Date(2025, 6, 5),
    endDate: new Date(2025, 6, 12),
    people: 4,
    created: new Date(2025, 5, 25),
    status: "pending"
  },
  {
    id: "3",
    name: "Petr Černý",
    email: "petr.cerny@example.com",
    phone: "+420 555 666 777",
    startDate: new Date(2025, 7, 10),
    endDate: new Date(2025, 7, 17),
    people: 3,
    created: new Date(2025, 6, 30),
    status: "confirmed"
  }
];

type ReservationStatus = "confirmed" | "pending" | "cancelled";

interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  startDate: Date;
  endDate: Date;
  people: number;
  created: Date;
  status: ReservationStatus;
}

const Admin = () => {
  const [reservations] = useState<Reservation[]>(mockReservations);

  const getStatusColor = (status: ReservationStatus) => {
    switch(status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "";
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
              {reservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell className="font-medium">{reservation.name}</TableCell>
                  <TableCell>
                    <div>{reservation.email}</div>
                    <div className="text-sm text-muted-foreground">{reservation.phone}</div>
                  </TableCell>
                  <TableCell>
                    {format(reservation.startDate, "d. MMMM", { locale: cs })} - {format(reservation.endDate, "d. MMMM yyyy", { locale: cs })}
                  </TableCell>
                  <TableCell>{reservation.people}</TableCell>
                  <TableCell>{format(reservation.created, "d.M.yyyy", { locale: cs })}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                      {reservation.status === "confirmed" && "Potvrzeno"}
                      {reservation.status === "pending" && "Čeká na potvrzení"}
                      {reservation.status === "cancelled" && "Zrušeno"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
