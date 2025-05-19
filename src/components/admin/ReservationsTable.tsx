import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { Check, X } from "lucide-react";
import { Reservation } from "@/lib/supabase/reservations";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";

type ReservationsTableProps = {
  loading: boolean;
  error: string | null;
  reservations: Reservation[];
  onStatusChange: (id: string, action: 'confirm' | 'cancel') => void;
};

export const ReservationsTable = ({
  loading,
  error,
  reservations,
  onStatusChange
}: ReservationsTableProps) => {
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

  // Filter reservations to group by status
  const pendingReservations = reservations.filter(r => r.status === 'pending');
  const confirmedReservations = reservations.filter(r => r.status === 'confirmed');
  const cancelledReservations = reservations.filter(r => r.status === 'cancelled');
  
  // Sort all reservations by arrival date - now we'll display newest dates at top
  // This matches the sorting done in the fetch function, but we keep the pending ones at the top
  const sortedReservations = [
    ...pendingReservations,
    ...confirmedReservations,
    ...cancelledReservations
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner className="h-8 w-8 text-forest-600" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  console.log("Total reservations:", reservations.length);
  console.log("Pending reservations:", pendingReservations.length);

  return (
    <div className="space-y-4">
      {pendingReservations.length > 0 && (
        <div className="px-2 py-1 bg-yellow-50 text-yellow-800 rounded inline-block text-sm font-medium">
          {pendingReservations.length} rezervací čeká na potvrzení
        </div>
      )}
      
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
          {sortedReservations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                Zatím nejsou žádné rezervace
              </TableCell>
            </TableRow>
          ) : (
            sortedReservations.map((reservation) => (
              <TableRow 
                key={reservation.id}
                className={reservation.status === 'pending' ? 'bg-yellow-50' : ''}
              >
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
                          onClick={() => onStatusChange(reservation.id!, 'confirm')}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Potvrdit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex items-center text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => onStatusChange(reservation.id!, 'cancel')}
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
    </div>
  );
};
