import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Users, Calendar, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface AvailabilityCalendarProps {
  experienceId: number;
  onDateSelect?: (date: string, available: boolean, remainingCapacity: number) => void;
  selectedDate?: string;
  requestedCapacity?: number;
}

const DAYS_OF_WEEK = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export function AvailabilityCalendar({
  experienceId,
  onDateSelect,
  selectedDate,
  requestedCapacity = 1,
}: AvailabilityCalendarProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const { data: calendarData, isLoading } = trpc.availability.getCalendar.useQuery({
    experienceId,
    year: currentYear,
    month: currentMonth,
  });

  const goToPreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Calculate the first day of the month (0 = Sunday)
  const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).getDay();

  // Create calendar grid
  const calendarGrid = useMemo(() => {
    if (!calendarData?.days) return [];

    const grid: (typeof calendarData.days[0] | null)[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      grid.push(null);
    }
    
    // Add the days of the month
    calendarData.days.forEach(day => {
      grid.push(day);
    });

    return grid;
  }, [calendarData, firstDayOfMonth]);

  const handleDateClick = (day: NonNullable<typeof calendarData>['days'][0] | null) => {
    if (!day || day.isPast || !day.isAvailable) return;
    
    const hasCapacity = day.remainingCapacity >= requestedCapacity;
    if (onDateSelect) {
      onDateSelect(day.date, hasCapacity, day.remainingCapacity);
    }
  };

  const getDateStatus = (day: NonNullable<typeof calendarData>['days'][0]) => {
    if (day.isPast) return "past";
    if (day.isBlocked) return "blocked";
    if (!day.isAvailable) return "unavailable";
    if (day.remainingCapacity === 0) return "full";
    if (day.remainingCapacity < requestedCapacity) return "limited";
    if (day.remainingCapacity <= 5) return "low";
    return "available";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "past":
        return "bg-gray-100 text-gray-400 cursor-not-allowed";
      case "blocked":
      case "unavailable":
        return "bg-red-50 text-red-300 cursor-not-allowed line-through";
      case "full":
        return "bg-red-100 text-red-500 cursor-not-allowed";
      case "limited":
        return "bg-amber-100 text-amber-700 cursor-pointer hover:bg-amber-200";
      case "low":
        return "bg-yellow-100 text-yellow-700 cursor-pointer hover:bg-yellow-200";
      case "available":
        return "bg-green-50 text-green-700 cursor-pointer hover:bg-green-100";
      default:
        return "bg-gray-50 text-gray-500";
    }
  };

  // Check if we can go to previous month (not before current month)
  const canGoPrevious = currentYear > today.getFullYear() || 
    (currentYear === today.getFullYear() && currentMonth > today.getMonth() + 1);

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Disponibilidad
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPreviousMonth}
              disabled={!canGoPrevious}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[140px] text-center">
              {MONTHS[currentMonth - 1]} {currentYear}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNextMonth}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS_OF_WEEK.map(day => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-muted-foreground py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarGrid.map((day, index) => {
                if (!day) {
                  return <div key={`empty-${index}`} className="aspect-square" />;
                }

                const status = getDateStatus(day);
                const isSelected = selectedDate === day.date;
                const canSelect = status === "available" || status === "low" || status === "limited";

                return (
                  <Tooltip key={day.date}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => handleDateClick(day)}
                        disabled={!canSelect}
                        className={cn(
                          "aspect-square rounded-md flex flex-col items-center justify-center text-sm transition-all relative",
                          getStatusColor(status),
                          isSelected && "ring-2 ring-primary ring-offset-1",
                          canSelect && "hover:scale-105"
                        )}
                      >
                        <span className="font-medium">{day.dayOfMonth}</span>
                        {canSelect && day.remainingCapacity <= 10 && (
                          <span className="text-[10px] leading-none">
                            {day.remainingCapacity}
                          </span>
                        )}
                        {day.specialPrice && (
                          <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      <div className="space-y-1">
                        <p className="font-medium">
                          {new Date(day.date).toLocaleDateString("es-MX", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                          })}
                        </p>
                        {day.isPast ? (
                          <p className="text-muted-foreground">Fecha pasada</p>
                        ) : day.isBlocked ? (
                          <p className="text-red-500">No disponible</p>
                        ) : !day.isAvailable ? (
                          <p className="text-red-500">Cerrado</p>
                        ) : (
                          <>
                            <p className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {day.remainingCapacity} lugares disponibles
                            </p>
                            {day.specialPrice && (
                              <p className="text-blue-600">
                                Precio especial: ${day.specialPrice}
                              </p>
                            )}
                            {day.notes && (
                              <p className="text-muted-foreground italic">
                                {day.notes}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                <Info className="h-3 w-3" />
                Leyenda:
              </p>
              <div className="flex flex-wrap gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded bg-green-50 border border-green-200" />
                  <span>Disponible</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-200" />
                  <span>Pocos lugares</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded bg-amber-100 border border-amber-200" />
                  <span>Capacidad limitada</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded bg-red-100 border border-red-200" />
                  <span>Lleno</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded bg-gray-100 border border-gray-200" />
                  <span>No disponible</span>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default AvailabilityCalendar;
