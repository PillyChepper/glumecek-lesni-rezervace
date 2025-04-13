
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';

type ReservationStatus = 'confirmed' | 'pending' | 'cancelled';

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
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: '1',
      name: 'Jana Nováková',
      email: 'jana@example.com',
      phone: '+420 777 123 456',
      startDate: new Date(2025, 3, 15),
      endDate: new Date(2025, 3, 18),
      people: 2,
      created: new Date(2025, 2, 10),
      status: 'confirmed',
    },
    {
      id: '2',
      name: 'Petr Svoboda',
      email: 'petr@example.com',
      phone: '+420 777 987 654',
      startDate: new Date(2025, 3, 20),
      endDate: new Date(2025, 3, 25),
      people: 4,
      created: new Date(2025, 2, 15),
      status: 'pending',
    }
  ]);
  
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleStatusChange = (id: string, status: ReservationStatus) => {
    setReservations(
      reservations.map(reservation => 
        reservation.id === id ? { ...reservation, status } : reservation
      )
    );
  };
  
  const handleViewDetails = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsDialogOpen(true);
  };
  
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Administrace rezervací</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Seznam rezervací</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Jméno</TableHead>
                <TableHead>Datum příjezdu</TableHead>
                <TableHead>Datum odjezdu</TableHead>
                <TableHead>Stav</TableHead>
                <TableHead>Akce</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>{reservation.name}</TableCell>
                  <TableCell>{format(reservation.startDate, 'P', { locale: cs })}</TableCell>
                  <TableCell>{format(reservation.endDate, 'P', { locale: cs })}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${
                        reservation.status === 'confirmed' ? 'bg-green-500' :
                        reservation.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                      }`}></span>
                      {reservation.status === 'confirmed' ? 'Potvrzeno' :
                       reservation.status === 'pending' ? 'Čeká na potvrzení' : 'Zrušeno'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(reservation)}
                      >
                        Detail
                      </Button>
                      {reservation.status === 'pending' && (
                        <Button 
                          variant="default" 
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleStatusChange(reservation.id, 'confirmed')}
                        >
                          Potvrdit
                        </Button>
                      )}
                      {reservation.status !== 'cancelled' && (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleStatusChange(reservation.id, 'cancelled')}
                        >
                          Zrušit
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {selectedReservation && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Detail rezervace</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Jméno</Label>
                  <Input value={selectedReservation.name} readOnly className="mt-1" />
                </div>
                <div>
                  <Label>Počet osob</Label>
                  <Input value={selectedReservation.people} readOnly className="mt-1" />
                </div>
              </div>
              <div>
                <Label>Email</Label>
                <Input value={selectedReservation.email} readOnly className="mt-1" />
              </div>
              <div>
                <Label>Telefon</Label>
                <Input value={selectedReservation.phone} readOnly className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Datum příjezdu</Label>
                  <Input value={format(selectedReservation.startDate, 'P', { locale: cs })} readOnly className="mt-1" />
                </div>
                <div>
                  <Label>Datum odjezdu</Label>
                  <Input value={format(selectedReservation.endDate, 'P', { locale: cs })} readOnly className="mt-1" />
                </div>
              </div>
              <div>
                <Label>Stav rezervace</Label>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`w-3 h-3 rounded-full ${
                    selectedReservation.status === 'confirmed' ? 'bg-green-500' :
                    selectedReservation.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                  }`}></span>
                  {selectedReservation.status === 'confirmed' ? 'Potvrzeno' :
                   selectedReservation.status === 'pending' ? 'Čeká na potvrzení' : 'Zrušeno'}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsDialogOpen(false)}>Zavřít</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Admin;
