
import { RefreshCw } from "lucide-react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ReservationsTable } from "@/components/admin/ReservationsTable";
import { ReservationStatusDialog } from "@/components/admin/ReservationStatusDialog";
import { useReservationsAdmin } from "@/hooks/useReservationsAdmin";
import { getSubdomain } from "@/utils/subdomains";
import { useEffect, useState } from "react";
import AdminNavbar from "@/components/admin/AdminNavbar";

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
  
  const [isAdminSubdomain, setIsAdminSubdomain] = useState(false);
  
  useEffect(() => {
    const subdomain = getSubdomain();
    setIsAdminSubdomain(subdomain === 'admin');
  }, []);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {isAdminSubdomain ? <AdminNavbar /> : <AdminSidebar />}
        <SidebarInset className={`px-4 md:px-8 ${isAdminSubdomain ? 'pt-16 pb-6' : 'py-6'}`}>
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
              {!isAdminSubdomain && <SidebarTrigger />}
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
