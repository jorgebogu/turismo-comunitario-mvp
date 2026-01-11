import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { 
  Calendar, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp,
  MapPin,
  Mail,
  Phone,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle
} from "lucide-react";
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { Link } from "wouter";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AdminDashboard() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [selectedExperience, setSelectedExperience] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"confirm" | "reject" | "complete">("confirm");
  const [responseMessage, setResponseMessage] = useState("");

  // Queries
  const { data: experiences } = trpc.communityAdmin.myExperiences.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: stats, refetch: refetchStats } = trpc.communityAdmin.getStats.useQuery(
    selectedExperience !== "all" ? { experienceId: parseInt(selectedExperience) } : undefined,
    { enabled: isAuthenticated }
  );

  const { data: reservations, refetch: refetchReservations } = trpc.communityAdmin.getReservations.useQuery(
    {
      experienceId: selectedExperience !== "all" ? parseInt(selectedExperience) : undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
    },
    { enabled: isAuthenticated }
  );

  // Mutations
  const confirmMutation = trpc.communityAdmin.confirmReservation.useMutation({
    onSuccess: () => {
      toast.success("Reservación confirmada exitosamente");
      refetchReservations();
      refetchStats();
      setActionDialogOpen(false);
      setResponseMessage("");
    },
    onError: (error) => {
      toast.error("Error al confirmar: " + error.message);
    },
  });

  const rejectMutation = trpc.communityAdmin.rejectReservation.useMutation({
    onSuccess: () => {
      toast.success("Reservación rechazada");
      refetchReservations();
      refetchStats();
      setActionDialogOpen(false);
      setResponseMessage("");
    },
    onError: (error) => {
      toast.error("Error al rechazar: " + error.message);
    },
  });

  const completeMutation = trpc.communityAdmin.completeReservation.useMutation({
    onSuccess: () => {
      toast.success("Reservación marcada como completada");
      refetchReservations();
      refetchStats();
      setActionDialogOpen(false);
      setResponseMessage("");
    },
    onError: (error) => {
      toast.error("Error al completar: " + error.message);
    },
  });

  const handleAction = () => {
    if (!selectedReservation) return;

    const payload = {
      id: selectedReservation.reservation.id,
      message: responseMessage || undefined,
    };

    if (actionType === "confirm") {
      confirmMutation.mutate(payload);
    } else if (actionType === "reject") {
      rejectMutation.mutate(payload);
    } else if (actionType === "complete") {
      completeMutation.mutate(payload);
    }
  };

  const openActionDialog = (reservation: any, type: "confirm" | "reject" | "complete") => {
    setSelectedReservation(reservation);
    setActionType(type);
    setResponseMessage("");
    setActionDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      pendiente: { variant: "secondary", label: "Pendiente" },
      confirmada: { variant: "default", label: "Confirmada" },
      completada: { variant: "outline", label: "Completada" },
      cancelada: { variant: "destructive", label: "Cancelada" },
      rechazada: { variant: "destructive", label: "Rechazada" },
    };
    const config = variants[status] || { variant: "secondary", label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Panel de Administración</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona las reservaciones y disponibilidad de tus experiencias turísticas
          </p>
        </div>

        {/* Acciones rápidas */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Link href="/admin/disponibilidad">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Gestionar Disponibilidad
            </Button>
          </Link>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Select value={selectedExperience} onValueChange={setSelectedExperience}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Todas las experiencias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las experiencias</SelectItem>
              {experiences?.map((exp) => (
                <SelectItem key={exp.id} value={exp.id.toString()}>
                  {exp.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="pendiente">Pendientes</SelectItem>
              <SelectItem value="confirmada">Confirmadas</SelectItem>
              <SelectItem value="completada">Completadas</SelectItem>
              <SelectItem value="cancelada">Canceladas</SelectItem>
              <SelectItem value="rechazada">Rechazadas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Total</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats?.total || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-muted-foreground">Pendientes</span>
              </div>
              <p className="text-2xl font-bold mt-1 text-yellow-600">{stats?.pendientes || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-muted-foreground">Confirmadas</span>
              </div>
              <p className="text-2xl font-bold mt-1 text-green-600">{stats?.confirmadas || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-muted-foreground">Completadas</span>
              </div>
              <p className="text-2xl font-bold mt-1 text-blue-600">{stats?.completadas || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Visitantes</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats?.totalVisitors || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Este mes</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats?.thisMonth || 0}</p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Reservaciones */}
        <Card>
          <CardHeader>
            <CardTitle>Reservaciones</CardTitle>
            <CardDescription>
              {reservations?.length || 0} reservaciones encontradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!reservations || reservations.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay reservaciones que mostrar</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reservations.map((item) => (
                  <div
                    key={item.reservation.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusBadge(item.reservation.status)}
                          <span className="text-sm text-muted-foreground">
                            #{item.reservation.id}
                          </span>
                        </div>
                        
                        <h3 className="font-semibold text-lg">
                          {item.experience?.name || "Experiencia"}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{item.reservation.visitorName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {format(new Date(item.reservation.visitDate), "PPP", { locale: es })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{item.reservation.visitorEmail}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {item.reservation.numberOfAdults} adultos
                              {(item.reservation.numberOfChildren || 0) > 0 && 
                                `, ${item.reservation.numberOfChildren} niños`}
                            </span>
                          </div>
                          {item.reservation.visitorPhone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{item.reservation.visitorPhone}</span>
                            </div>
                          )}
                        </div>

                        {item.reservation.message && (
                          <div className="mt-3 p-3 bg-muted rounded-md">
                            <div className="flex items-start gap-2">
                              <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <p className="text-sm">{item.reservation.message}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Acciones */}
                      <div className="flex flex-wrap gap-2">
                        {item.reservation.status === "pendiente" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => openActionDialog(item, "confirm")}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Confirmar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => openActionDialog(item, "reject")}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Rechazar
                            </Button>
                          </>
                        )}
                        {item.reservation.status === "confirmada" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openActionDialog(item, "complete")}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Marcar Completada
                          </Button>
                        )}
                      </div>
                    </div>

                    {item.reservation.communityResponse && (
                      <div className="mt-3 p-3 bg-primary/5 border-l-4 border-primary rounded-r-md">
                        <p className="text-sm font-medium text-primary">Respuesta de la comunidad:</p>
                        <p className="text-sm mt-1">{item.reservation.communityResponse}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Dialog de Acción */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "confirm" && "Confirmar Reservación"}
              {actionType === "reject" && "Rechazar Reservación"}
              {actionType === "complete" && "Marcar como Completada"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "confirm" && 
                "La reservación será confirmada y el visitante será notificado."}
              {actionType === "reject" && 
                "La reservación será rechazada. Por favor, proporciona un motivo."}
              {actionType === "complete" && 
                "La reservación será marcada como completada."}
            </DialogDescription>
          </DialogHeader>

          {selectedReservation && (
            <div className="py-4">
              <div className="bg-muted p-3 rounded-md mb-4">
                <p className="font-medium">{selectedReservation.experience?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedReservation.reservation.visitorName} - 
                  {format(new Date(selectedReservation.reservation.visitDate), " PPP", { locale: es })}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Mensaje para el visitante (opcional)
                </label>
                <Textarea
                  placeholder="Escribe un mensaje..."
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleAction}
              disabled={confirmMutation.isPending || rejectMutation.isPending || completeMutation.isPending}
              className={
                actionType === "reject" ? "bg-destructive hover:bg-destructive/90" :
                actionType === "confirm" ? "bg-green-600 hover:bg-green-700" : ""
              }
            >
              {(confirmMutation.isPending || rejectMutation.isPending || completeMutation.isPending) && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {actionType === "confirm" && "Confirmar"}
              {actionType === "reject" && "Rechazar"}
              {actionType === "complete" && "Completar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
