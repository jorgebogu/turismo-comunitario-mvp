import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Loader2,
  Lock,
  Unlock,
  Users,
  Settings
} from "lucide-react";
import { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isBefore, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function AdminAvailability() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [selectedExperience, setSelectedExperience] = useState<string>("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [maxCapacity, setMaxCapacity] = useState(20);
  const [isAvailable, setIsAvailable] = useState(true);
  const [notes, setNotes] = useState("");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  // Queries
  const { data: experiences } = trpc.communityAdmin.myExperiences.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: calendarData, refetch: refetchCalendar } = trpc.availability.getCalendar.useQuery(
    {
      experienceId: parseInt(selectedExperience),
      year,
      month,
    },
    { enabled: isAuthenticated && !!selectedExperience }
  );

  const { data: reservationsData } = trpc.communityAdmin.getCalendarReservations.useQuery(
    {
      experienceId: parseInt(selectedExperience),
      year,
      month,
    },
    { enabled: isAuthenticated && !!selectedExperience }
  );

  // Mutations
  const setAvailabilityMutation = trpc.availability.setDateAvailability.useMutation({
    onSuccess: () => {
      toast.success("Disponibilidad actualizada");
      refetchCalendar();
      setEditDialogOpen(false);
    },
    onError: (error) => {
      toast.error("Error: " + error.message);
    },
  });

  const blockDateMutation = trpc.availability.blockDate.useMutation({
    onSuccess: () => {
      toast.success("Fecha bloqueada");
      refetchCalendar();
    },
    onError: (error) => {
      toast.error("Error: " + error.message);
    },
  });

  const unblockDateMutation = trpc.availability.unblockDate.useMutation({
    onSuccess: () => {
      toast.success("Fecha desbloqueada");
      refetchCalendar();
    },
    onError: (error) => {
      toast.error("Error: " + error.message);
    },
  });

  // Calendar days
  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start, end });
    
    // Add padding days for the start of the week
    const startDay = start.getDay();
    const paddingDays = Array(startDay).fill(null);
    
    return [...paddingDays, ...days];
  }, [currentDate]);

  // Create a map of availability data
  const availabilityMap = useMemo(() => {
    const map = new Map<string, any>();
    calendarData?.days?.forEach((item: any) => {
      const dateKey = format(new Date(item.date), "yyyy-MM-dd");
      map.set(dateKey, item);
    });
    return map;
  }, [calendarData]);

  // Create a map of reservations per day
  const reservationsMap = useMemo(() => {
    const map = new Map<string, { count: number; visitors: number }>();
    reservationsData?.forEach((res: any) => {
      const dateKey = format(new Date(res.visitDate), "yyyy-MM-dd");
      const existing = map.get(dateKey) || { count: 0, visitors: 0 };
      map.set(dateKey, {
        count: existing.count + 1,
        visitors: existing.visitors + res.numberOfAdults + (res.numberOfChildren || 0),
      });
    });
    return map;
  }, [reservationsData]);

  const handleDateClick = (date: Date) => {
    if (isBefore(date, startOfDay(new Date()))) return;
    
    setSelectedDate(date);
    const dateKey = format(date, "yyyy-MM-dd");
    const availability = availabilityMap.get(dateKey);
    
    if (availability) {
      setMaxCapacity(availability.maxCapacity);
      setIsAvailable(availability.isAvailable);
      setNotes(availability.notes || "");
    } else {
      setMaxCapacity(20);
      setIsAvailable(true);
      setNotes("");
    }
    
    setEditDialogOpen(true);
  };

  const handleSaveAvailability = () => {
    if (!selectedDate || !selectedExperience) return;
    
    setAvailabilityMutation.mutate({
      experienceId: parseInt(selectedExperience),
      date: format(selectedDate, "yyyy-MM-dd"),
      maxCapacity,
      isAvailable,
      notes: notes || undefined,
    });
  };

  const handleQuickBlock = (date: Date) => {
    if (!selectedExperience) return;
    
    const dateKey = format(date, "yyyy-MM-dd");
    const availability = availabilityMap.get(dateKey);
    
    if (availability?.isBlocked) {
      unblockDateMutation.mutate({
        experienceId: parseInt(selectedExperience),
        date: dateKey,
      });
    } else {
      blockDateMutation.mutate({
        experienceId: parseInt(selectedExperience),
        date: dateKey,
        reason: "Bloqueado manualmente",
      });
    }
  };

  const getDayStatus = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const availability = availabilityMap.get(dateKey);
    const reservations = reservationsMap.get(dateKey);
    const isPast = isBefore(date, startOfDay(new Date()));
    
    if (isPast) return "past";
    if (availability?.isBlocked) return "blocked";
    if (!availability?.isAvailable) return "unavailable";
    
    const capacity = availability?.maxCapacity || 20;
    const booked = reservations?.visitors || 0;
    const remaining = capacity - booked;
    
    if (remaining <= 0) return "full";
    if (remaining <= capacity * 0.3) return "limited";
    return "available";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-100 hover:bg-green-200 text-green-800";
      case "limited": return "bg-yellow-100 hover:bg-yellow-200 text-yellow-800";
      case "full": return "bg-red-100 hover:bg-red-200 text-red-800";
      case "blocked": return "bg-gray-300 text-gray-600";
      case "unavailable": return "bg-gray-200 text-gray-500";
      case "past": return "bg-gray-100 text-gray-400";
      default: return "bg-white hover:bg-gray-50";
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Acceso Restringido</CardTitle>
              <CardDescription>
                Debes iniciar sesión para acceder al panel de administración.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <a href={getLoginUrl()}>Iniciar Sesión</a>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Volver al Panel
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestión de Disponibilidad</h1>
            <p className="text-muted-foreground mt-1">
              Configura los días y capacidad disponible para tus experiencias
            </p>
          </div>
        </div>

        {/* Selector de Experiencia */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[250px]">
                <Label>Selecciona una experiencia</Label>
                <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Elige una experiencia" />
                  </SelectTrigger>
                  <SelectContent>
                    {experiences?.map((exp) => (
                      <SelectItem key={exp.id} value={exp.id.toString()}>
                        {exp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedExperience ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Calendario de Disponibilidad</CardTitle>
                  <CardDescription>
                    Haz clic en un día para editar su disponibilidad
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentDate(new Date(year, month - 2, 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="font-medium min-w-[150px] text-center">
                    {format(currentDate, "MMMM yyyy", { locale: es })}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentDate(new Date(year, month, 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Leyenda */}
              <div className="flex flex-wrap gap-4 mb-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-100 border border-green-300" />
                  <span>Disponible</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-300" />
                  <span>Pocos lugares</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-100 border border-red-300" />
                  <span>Lleno</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-300 border border-gray-400" />
                  <span>Bloqueado</span>
                </div>
              </div>

              {/* Calendario */}
              <div className="grid grid-cols-7 gap-1">
                {/* Headers */}
                {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                  <div key={day} className="text-center font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
                
                {/* Days */}
                {calendarDays.map((date, index) => {
                  if (!date) {
                    return <div key={`empty-${index}`} className="aspect-square" />;
                  }
                  
                  const status = getDayStatus(date);
                  const dateKey = format(date, "yyyy-MM-dd");
                  const availability = availabilityMap.get(dateKey);
                  const reservations = reservationsMap.get(dateKey);
                  const isPast = status === "past";
                  
                  return (
                    <div
                      key={dateKey}
                      className={`
                        aspect-square p-1 rounded-lg border transition-colors relative
                        ${getStatusColor(status)}
                        ${!isPast ? "cursor-pointer" : "cursor-not-allowed"}
                        ${isToday(date) ? "ring-2 ring-primary ring-offset-2" : ""}
                      `}
                      onClick={() => !isPast && handleDateClick(date)}
                    >
                      <div className="text-sm font-medium">{format(date, "d")}</div>
                      {!isPast && (
                        <div className="text-xs mt-1">
                          {availability?.isBlocked ? (
                            <Lock className="h-3 w-3" />
                          ) : reservations ? (
                            <span>{reservations.visitors}/{availability?.maxCapacity || 20}</span>
                          ) : (
                            <span className="opacity-50">{availability?.maxCapacity || 20}</span>
                          )}
                        </div>
                      )}
                      {!isPast && status !== "blocked" && (
                        <button
                          className="absolute top-1 right-1 p-0.5 rounded hover:bg-black/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickBlock(date);
                          }}
                        >
                          {availability?.isBlocked ? (
                            <Unlock className="h-3 w-3" />
                          ) : (
                            <Lock className="h-3 w-3 opacity-30 hover:opacity-100" />
                          )}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Selecciona una experiencia para ver y gestionar su disponibilidad</p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Dialog de Edición */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configurar Disponibilidad</DialogTitle>
            <DialogDescription>
              {selectedDate && format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="available">Disponible para reservaciones</Label>
              <Switch
                id="available"
                checked={isAvailable}
                onCheckedChange={setIsAvailable}
              />
            </div>

            {isAvailable && (
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacidad máxima de visitantes</Label>
                <Input
                  id="capacity"
                  type="number"
                  min={1}
                  value={maxCapacity}
                  onChange={(e) => setMaxCapacity(parseInt(e.target.value) || 1)}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Notas (opcional)</Label>
              <Textarea
                id="notes"
                placeholder="Notas internas sobre este día..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSaveAvailability}
              disabled={setAvailabilityMutation.isPending}
            >
              {setAvailabilityMutation.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
