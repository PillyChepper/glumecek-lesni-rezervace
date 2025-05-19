
import { RefreshCw } from "lucide-react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ReservationsTable } from "@/components/admin/ReservationsTable";
import { ReservationStatusDialog } from "@/components/admin/ReservationStatusDialog";
import { useReservationsAdmin } from "@/hooks/useReservationsAdmin";

const Admin = () => {
  const {
    reservations,
    loading,
    error,
    confirmDialogOpen,
    setConfirmDialogOpen,
    selectedReservation,
    handleStatusUpdate,
    openConfirmDialog,
    fetchReservations
  } = useReservationsAdmin();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <SidebarInset className="px-4 py-6 md:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="section-title">Rezervace</h1>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchReservations}
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-4 w-4" />
                Obnovit
              </Button>
              <SidebarTrigger />
            </div>
          </div>

          <ReservationsTable
            loading={loading}
            error={error}
            reservations={reservations}
            onStatusChange={openConfirmDialog}
          />

          <ReservationStatusDialog
            open={confirmDialogOpen}
            onOpenChange={setConfirmDialogOpen}
            action={selectedReservation?.action || null}
            onConfirm={handleStatusUpdate}
          />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
