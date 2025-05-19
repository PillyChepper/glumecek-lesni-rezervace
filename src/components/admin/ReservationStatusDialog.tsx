
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

type ReservationStatusDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: 'confirm' | 'cancel' | null;
  onConfirm: () => void;
};

export const ReservationStatusDialog = ({
  open,
  onOpenChange,
  action,
  onConfirm
}: ReservationStatusDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {action === 'confirm' 
              ? 'Potvrdit rezervaci' 
              : 'Zamítnout rezervaci'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {action === 'confirm'
              ? 'Opravdu chcete potvrdit tuto rezervaci? Klient bude informován o potvrzení.'
              : 'Opravdu chcete zamítnout tuto rezervaci? Klient bude informován o zamítnutí.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Zrušit</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className={action === 'confirm' 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-red-600 hover:bg-red-700 text-white'}
          >
            {action === 'confirm' ? 'Potvrdit' : 'Zamítnout'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
