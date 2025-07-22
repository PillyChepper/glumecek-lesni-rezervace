
import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { cs } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import AvailabilityLegend from './AvailabilityLegend';
import CalendarStatsPanel from './CalendarStatsPanel';
import { useIsMobile } from '@/hooks/use-mobile';

interface EnhancedAvailabilityCalendarProps {
  disabledDates: Date[];
  onDateRangeSelect?: (from: Date, to: Date) => void;
  showBookingCTA?: boolean;
}

const EnhancedAvailabilityCalendar = ({ 
  disabledDates, 
  onDateRangeSelect,
  showBookingCTA = true 
}: EnhancedAvailabilityCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState<{ from?: Date; to?: Date }>({});
  const isMobile = useIsMobile();

  const monthsToShow = isMobile ? 1 : 3;

  const months = useMemo(() => {
    const result = [];
    for (let i = 0; i < monthsToShow; i++) {
      result.push(addMonths(currentMonth, i));
    }
    return result;
  }, [currentMonth, monthsToShow]);

  const getDayStatus = (date: Date) => {
    const isDisabled = disabledDates.some(disabledDate => 
      isSameDay(date, disabledDate)
    );
    
    if (isDisabled) return 'booked';
    if (date < new Date()) return 'past';
    return 'available';
  };

  const handleDayClick = (date: Date) => {
    const status = getDayStatus(date);
    if (status === 'booked' || status === 'past') return;

    if (!selectedRange.from) {
      setSelectedRange({ from: date });
    } else if (!selectedRange.to) {
      if (date < selectedRange.from) {
        setSelectedRange({ from: date });
      } else {
        setSelectedRange({ from: selectedRange.from, to: date });
        if (onDateRangeSelect) {
          onDateRangeSelect(selectedRange.from, date);
        }
      }
    } else {
      setSelectedRange({ from: date });
    }
  };

  const renderMonth = (month: Date) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Add empty cells for days before month starts
    const startDay = monthStart.getDay();
    const emptyDays = Array.from({ length: startDay === 0 ? 6 : startDay - 1 });

    return (
      <Card key={month.getTime()} className="flex-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-center">
            {format(month, 'LLLL yyyy', { locale: cs })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {emptyDays.map((_, index) => (
              <div key={`empty-${index}`} className="h-10"></div>
            ))}
            {days.map(day => {
              const status = getDayStatus(day);
              const isSelected = selectedRange.from && isSameDay(day, selectedRange.from) ||
                               selectedRange.to && isSameDay(day, selectedRange.to);
              const isInRange = selectedRange.from && selectedRange.to &&
                              day >= selectedRange.from && day <= selectedRange.to;

              return (
                <Button
                  key={day.getTime()}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-10 w-full text-sm relative",
                    status === 'available' && "hover:bg-forest-100 text-forest-700",
                    status === 'booked' && "bg-red-100 text-red-700 cursor-not-allowed",
                    status === 'past' && "text-muted-foreground cursor-not-allowed opacity-50",
                    isSelected && "bg-forest-600 text-white hover:bg-forest-700",
                    isInRange && !isSelected && "bg-forest-200 text-forest-800",
                    !isSameMonth(day, month) && "opacity-30"
                  )}
                  onClick={() => handleDayClick(day)}
                  disabled={status === 'booked' || status === 'past'}
                >
                  {format(day, 'd')}
                  {status === 'booked' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                    </div>
                  )}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-display font-medium text-forest-700 flex items-center gap-2">
          <CalendarIcon className="h-6 w-6" />
          Dostupnost ubytování
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <div className={cn(
            "grid gap-4",
            isMobile ? "grid-cols-1" : "grid-cols-3"
          )}>
            {months.map(renderMonth)}
          </div>
        </div>
        
        <div className="space-y-4">
          <CalendarStatsPanel 
            disabledDates={disabledDates}
            currentMonth={currentMonth}
            monthsToShow={monthsToShow}
          />
          <AvailabilityLegend />
          
          {selectedRange.from && selectedRange.to && showBookingCTA && (
            <Card className="bg-forest-50 border-forest-200">
              <CardContent className="pt-4">
                <div className="text-center space-y-2">
                  <p className="text-sm text-forest-700">
                    Vybrané období:
                  </p>
                  <p className="font-medium">
                    {format(selectedRange.from, 'dd.MM.yyyy')} - {format(selectedRange.to, 'dd.MM.yyyy')}
                  </p>
                  <Button 
                    className="w-full bg-forest-600 hover:bg-forest-700"
                    onClick={() => {
                      // Navigate to booking page with selected dates
                      const fromDate = selectedRange.from!.toISOString();
                      const toDate = selectedRange.to!.toISOString();
                      window.location.href = `/rezervace?from=${fromDate}&to=${toDate}`;
                    }}
                  >
                    Rezervovat termín
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedAvailabilityCalendar;
