
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { cs } from "date-fns/locale";

interface DatePickerInputProps {
  date: Date | undefined;
  label: string;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
}

const DatePickerInput = ({ 
  date, 
  label, 
  onClick, 
  isActive = false,
  disabled = false
}: DatePickerInputProps) => {
  return (
    <Button
      variant={"outline"}
      onClick={onClick}
      className={cn(
        "w-full justify-start text-left font-normal",
        !date && "text-muted-foreground",
        isActive && "ring-2 ring-forest-400 ring-offset-2",
        "h-12"
      )}
      disabled={disabled}
    >
      {date ? (
        format(date, "P", { locale: cs })
      ) : (
        <span>{label}</span>
      )}
      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
    </Button>
  );
};

export default DatePickerInput;
