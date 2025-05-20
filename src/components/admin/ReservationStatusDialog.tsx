
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
  action: 'confirm' | 'cancel' | 'cancel-confirmed' | null;
  onConfirm: () => void;
};

export const ReservationStatusDialog = ({
  open,
  onOpenChange,
  action,
  onConfirm
}: ReservationStatusDialogProps) => {
  // Get title and description based on action
  let title = '';
  let description = '';
  let buttonText = '';
  let buttonClass = '';
  
  switch(action) {
    case 'confirm':
      title = 'Potvrdit rezervaci';
      description = 'Opravdu chcete potvrdit tuto rezervaci? Klient bude informován o potvrzení.';
      buttonText = 'Potvrdit';
      buttonClass = 'bg-green-600 hover:bg-green-700 text-white';
      break;
    case 'cancel':
      title = 'Zamítnout rezervaci';
      description = 'Opravdu chcete zamítnout tuto rezervaci? Klient bude informován o zamítnutí.';
      buttonText = 'Zamítnout';
      buttonClass = 'bg-red-600 hover:bg-red-700 text-white';
      break;
    case 'cancel-confirmed':
      title = 'Zrušit potvrzenou rezervaci';
      description = 'Opravdu chcete zrušit tuto již potvrzenou rezervaci? Klient bude informován o zrušení.';
      buttonText = 'Zrušit rezervaci';
      buttonClass = 'bg-red-600 hover:bg-red-700 text-white';
      break;
    default:
      return null;
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Zpět</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className={buttonClass}
          >
            {buttonText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
