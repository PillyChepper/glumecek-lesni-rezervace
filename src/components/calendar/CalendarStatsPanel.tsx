
import { useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, isSameDay } from 'date-fns';
import { cs } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, Clock } from 'lucide-react';

interface CalendarStatsPanelProps {
  disabledDates: Date[];
  currentMonth: Date;
  monthsToShow: number;
}

const CalendarStatsPanel = ({ disabledDates, currentMonth, monthsToShow }: CalendarStatsPanelProps) => {
  const stats = useMemo(() => {
    const months = [];
    for (let i = 0; i < monthsToShow; i++) {
      months.push(addMonths(currentMonth, i));
    }

    const monthStats = months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
      
      const futureDays = allDays.filter(day => day >= new Date());
      const bookedDays = futureDays.filter(day => 
        disabledDates.some(disabledDate => isSameDay(day, disabledDate))
      );
      const availableDays = futureDays.length - bookedDays.length;

      return {
        month,
        totalDays: allDays.length,
        futureDays: futureDays.length,
        availableDays,
        bookedDays: bookedDays.length,
        occupancyRate: futureDays.length > 0 ? Math.round((bookedDays.length / futureDays.length) * 100) : 0
      };
    });

    const totalAvailable = monthStats.reduce((sum, stat) => sum + stat.availableDays, 0);
    const totalBooked = monthStats.reduce((sum, stat) => sum + stat.bookedDays, 0);
    const averageOccupancy = monthStats.length > 0 
      ? Math.round(monthStats.reduce((sum, stat) => sum + stat.occupancyRate, 0) / monthStats.length)
      : 0;

    return { monthStats, totalAvailable, totalBooked, averageOccupancy };
  }, [disabledDates, currentMonth, monthsToShow]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Přehled dostupnosti
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-2 bg-forest-50 rounded-lg">
              <p className="text-2xl font-bold text-forest-700">{stats.totalAvailable}</p>
              <p className="text-xs text-muted-foreground">Volných dní</p>
            </div>
            <div className="text-center p-2 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-700">{stats.totalBooked}</p>
              <p className="text-xs text-muted-foreground">Obsazených dní</p>
            </div>
          </div>
          
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <p className="text-xl font-bold text-blue-700">{stats.averageOccupancy}%</p>
            <p className="text-xs text-muted-foreground">Průměrná obsazenost</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Měsíční přehled
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {stats.monthStats.map((stat) => (
            <div key={stat.month.getTime()} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div>
                <p className="text-sm font-medium">
                  {format(stat.month, 'LLLL', { locale: cs })}
                </p>
                <p className="text-xs text-muted-foreground">
                  {stat.availableDays} volných z {stat.futureDays}
                </p>
              </div>
              <Badge variant={stat.occupancyRate > 70 ? "destructive" : stat.occupancyRate > 40 ? "default" : "secondary"}>
                {stat.occupancyRate}%
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarStatsPanel;
