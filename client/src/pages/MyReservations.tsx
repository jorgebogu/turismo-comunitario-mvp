import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";
import { 
  Calendar, 
  Users, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Loader2,
  CalendarDays,
  ArrowRight
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pendiente: { 
    label: "Pendiente", 
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: <Clock className="h-4 w-4" />
  },
  confirmada: { 
    label: "Confirmada", 
    color: "bg-green-100 text-green-800 border-green-200",
    icon: <CheckCircle2 className="h-4 w-4" />
  },
  cancelada: { 
    label: "Cancelada", 
    color: "bg-red-100 text-red-800 border-red-200",
    icon: <XCircle className="h-4 w-4" />
  },
  completada: { 
    label: "Completada", 
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: <CheckCircle2 className="h-4 w-4" />
  },
  rechazada: { 
    label: "Rechazada", 
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: <AlertCircle className="h-4 w-4" />
  },
};

export default function MyReservations() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  const { data: reservations, isLoading } = trpc.reservations.myReservations.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const { data: stats } = trpc.reservations.myStats.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const cancelMutation = trpc.reservations.cancel.useMutation({
    onSuccess: () => {
      toast.success("Reservación cancelada exitosamente");
      utils.reservations.myReservations.invalidate();
      utils.reservations.myStats.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Error al cancelar la reservación");
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <SEOHead
        title="Mis Reservaciones"
        description="Consulta y gestiona tus reservaciones de experiencias de turismo comunitario en México."
        keywords="mis reservaciones, reservas turismo comunitario, gestión reservas"
        noIndex
      />
      <Navbar />
        <main className="flex-1 container py-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container py-16">
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="rounded-full bg-primary/10 p-4 w-fit mx-auto">
              <CalendarDays className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Mis Reservaciones</h1>
            <p className="text-muted-foreground">
              Inicia sesión para ver y gestionar tus solicitudes de reservación.
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <a href={getLoginUrl()}>Iniciar Sesión</a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mis Reservaciones</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona tus solicitudes de visita a experiencias de turismo comunitario
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary">{stats.total}</div>
                <p className="text-sm text-muted-foreground">Total</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-yellow-600">{stats.pendientes}</div>
                <p className="text-sm text-muted-foreground">Pendientes</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">{stats.confirmadas}</div>
                <p className="text-sm text-muted-foreground">Confirmadas</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-blue-600">{stats.completadas}</div>
                <p className="text-sm text-muted-foreground">Completadas</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reservations List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Skeleton className="h-24 w-24 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : reservations && reservations.length > 0 ? (
          <div className="space-y-4">
            {reservations.map((reservation) => {
              const status = statusConfig[reservation.status] || statusConfig.pendiente;
              const experience = reservation.experience;
              
              return (
                <Card key={reservation.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Image */}
                      <div className="md:w-48 h-48 md:h-auto">
                        <img
                          src={experience?.imageUrl || "/placeholder-experience.jpg"}
                          alt={experience?.name || "Experiencia"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 p-6">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                          <div>
                            <Link href={`/experiencia/${reservation.experienceId}`}>
                              <h3 className="text-lg font-semibold hover:text-primary transition-colors">
                                {experience?.name || "Experiencia"}
                              </h3>
                            </Link>
                            {experience?.state && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                <MapPin className="h-4 w-4" />
                                {experience.state}
                              </div>
                            )}
                          </div>
                          <Badge className={`${status.color} flex items-center gap-1`}>
                            {status.icon}
                            {status.label}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {format(new Date(reservation.visitDate), "PPP", { locale: es })}
                              {reservation.visitEndDate && (
                                <> - {format(new Date(reservation.visitEndDate), "PPP", { locale: es })}</>
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {reservation.numberOfAdults} adulto{reservation.numberOfAdults !== 1 ? "s" : ""}
                              {(reservation.numberOfChildren ?? 0) > 0 && (
                                <>, {reservation.numberOfChildren} niño{(reservation.numberOfChildren ?? 0) !== 1 ? "s" : ""}</>
                              )}
                            </span>
                          </div>
                        </div>

                        {reservation.message && (
                          <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                            "{reservation.message}"
                          </p>
                        )}

                        {reservation.communityResponse && (
                          <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-100">
                            <p className="text-sm font-medium text-green-800">Respuesta de la comunidad:</p>
                            <p className="text-sm text-green-700 mt-1">{reservation.communityResponse}</p>
                          </div>
                        )}

                        <div className="flex items-center gap-2 mt-4">
                          <Link href={`/experiencia/${reservation.experienceId}`}>
                            <Button variant="outline" size="sm">
                              Ver Experiencia
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                          
                          {reservation.status === "pendiente" && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                  Cancelar
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Cancelar reservación?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. La comunidad será notificada de la cancelación.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>No, mantener</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => cancelMutation.mutate({ id: reservation.id })}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    {cancelMutation.isPending ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      "Sí, cancelar"
                                    )}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>

                        <p className="text-xs text-muted-foreground mt-4">
                          Solicitada el {format(new Date(reservation.createdAt), "PPP", { locale: es })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="rounded-full bg-primary/10 p-4 w-fit mx-auto mb-4">
                <CalendarDays className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No tienes reservaciones</h3>
              <p className="text-muted-foreground mb-6">
                Explora nuestras experiencias de turismo comunitario y solicita tu primera visita.
              </p>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/geoportal">
                  Explorar Experiencias
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}
