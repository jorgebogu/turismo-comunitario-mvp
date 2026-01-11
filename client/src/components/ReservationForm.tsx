import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Users, Mail, Phone, MessageSquare, Loader2, CheckCircle2, AlertTriangle, Calendar } from "lucide-react";
import { getLoginUrl } from "@/const";
import { AvailabilityCalendar } from "./AvailabilityCalendar";

interface ReservationFormProps {
  experienceId: number;
  experienceName: string;
  communityEmail?: string | null;
  communityPhone?: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReservationForm({
  experienceId,
  experienceName,
  communityEmail,
  communityPhone,
  isOpen,
  onClose,
}: ReservationFormProps) {
  const { user, isAuthenticated } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const [dateAvailable, setDateAvailable] = useState(true);
  const [remainingCapacity, setRemainingCapacity] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    visitorName: user?.name || "",
    visitorEmail: user?.email || "",
    visitorPhone: "",
    numberOfAdults: 1,
    numberOfChildren: 0,
    message: "",
    specialRequirements: "",
  });

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        visitorName: user.name || prev.visitorName,
        visitorEmail: user.email || prev.visitorEmail,
      }));
    }
  }, [user]);

  const totalPeople = formData.numberOfAdults + formData.numberOfChildren;

  // Check availability when date or capacity changes
  const { data: availabilityCheck } = trpc.availability.checkDate.useQuery(
    {
      experienceId,
      date: selectedDate || "",
      requestedCapacity: totalPeople,
    },
    {
      enabled: !!selectedDate && totalPeople > 0,
    }
  );

  const createReservation = trpc.reservations.create.useMutation({
    onSuccess: () => {
      setShowSuccess(true);
    },
    onError: (error) => {
      toast.error(error.message || "Error al enviar la solicitud");
    },
  });

  const handleDateSelect = (date: string, available: boolean, capacity: number) => {
    setSelectedDate(date);
    setDateAvailable(available);
    setRemainingCapacity(capacity);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate) {
      toast.error("Por favor selecciona una fecha de visita");
      return;
    }

    if (availabilityCheck && !availabilityCheck.available) {
      toast.error(availabilityCheck.reason || "La fecha seleccionada no está disponible");
      return;
    }

    createReservation.mutate({
      experienceId,
      visitorName: formData.visitorName,
      visitorEmail: formData.visitorEmail,
      visitorPhone: formData.visitorPhone || undefined,
      visitDate: new Date(selectedDate).toISOString(),
      numberOfAdults: formData.numberOfAdults,
      numberOfChildren: formData.numberOfChildren,
      message: formData.message || undefined,
      specialRequirements: formData.specialRequirements || undefined,
    });
  };

  const handleClose = () => {
    setShowSuccess(false);
    setFormData({
      visitorName: user?.name || "",
      visitorEmail: user?.email || "",
      visitorPhone: "",
      numberOfAdults: 1,
      numberOfChildren: 0,
      message: "",
      specialRequirements: "",
    });
    setSelectedDate(undefined);
    setDateAvailable(true);
    setRemainingCapacity(0);
    onClose();
  };

  if (!isAuthenticated) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Iniciar Sesión Requerido</DialogTitle>
            <DialogDescription>
              Para solicitar una reservación, necesitas iniciar sesión en tu cuenta.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <p className="text-sm text-muted-foreground">
              Una vez que inicies sesión, podrás enviar solicitudes de reservación directamente a las comunidades.
            </p>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <a href={getLoginUrl()}>Iniciar Sesión</a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-center">¡Solicitud Enviada!</DialogTitle>
              <DialogDescription className="text-center">
                Tu solicitud de reservación para <strong>{experienceName}</strong> ha sido enviada exitosamente.
              </DialogDescription>
            </DialogHeader>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>La comunidad recibirá tu solicitud y te contactará pronto para confirmar los detalles.</p>
              {selectedDate && (
                <p className="flex items-center justify-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Fecha solicitada: <strong>{new Date(selectedDate).toLocaleDateString("es-MX", { 
                    weekday: "long", 
                    day: "numeric", 
                    month: "long", 
                    year: "numeric" 
                  })}</strong>
                </p>
              )}
              {communityEmail && (
                <p>También puedes contactarlos directamente: <strong>{communityEmail}</strong></p>
              )}
            </div>
            <Button onClick={handleClose} className="mt-4">
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Solicitar Reservación</DialogTitle>
          <DialogDescription>
            Completa el formulario para solicitar una visita a <strong>{experienceName}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Calendario de disponibilidad */}
          <div className="space-y-2">
            <Label className="text-base font-medium">1. Selecciona una fecha disponible *</Label>
            <AvailabilityCalendar
              experienceId={experienceId}
              onDateSelect={handleDateSelect}
              selectedDate={selectedDate}
              requestedCapacity={totalPeople}
            />
            
            {selectedDate && (
              <div className="mt-2">
                {availabilityCheck?.available ? (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">
                      Fecha disponible: {new Date(selectedDate).toLocaleDateString("es-MX", { 
                        weekday: "long", 
                        day: "numeric", 
                        month: "long" 
                      })}
                      {availabilityCheck.remainingCapacity !== undefined && (
                        <span className="ml-2">
                          ({availabilityCheck.remainingCapacity} lugares disponibles)
                        </span>
                      )}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="destructive" className="bg-red-50 border-red-200">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      {availabilityCheck?.reason || "Esta fecha no está disponible"}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </div>

          {/* Número de personas */}
          <div className="space-y-2">
            <Label className="text-base font-medium">2. ¿Cuántas personas asistirán? *</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numberOfAdults" className="text-sm">Adultos</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="numberOfAdults"
                    type="number"
                    min={1}
                    max={50}
                    value={formData.numberOfAdults}
                    onChange={(e) => setFormData({ ...formData, numberOfAdults: parseInt(e.target.value) || 1 })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="numberOfChildren" className="text-sm">Niños</Label>
                <Input
                  id="numberOfChildren"
                  type="number"
                  min={0}
                  max={50}
                  value={formData.numberOfChildren}
                  onChange={(e) => setFormData({ ...formData, numberOfChildren: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Total: {totalPeople} {totalPeople === 1 ? "persona" : "personas"}
            </p>
          </div>

          {/* Información del visitante */}
          <div className="space-y-4">
            <Label className="text-base font-medium">3. Información de contacto *</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="visitorName" className="text-sm">Nombre completo</Label>
                <Input
                  id="visitorName"
                  value={formData.visitorName}
                  onChange={(e) => setFormData({ ...formData, visitorName: e.target.value })}
                  placeholder="Tu nombre"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="visitorEmail" className="text-sm">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="visitorEmail"
                    type="email"
                    value={formData.visitorEmail}
                    onChange={(e) => setFormData({ ...formData, visitorEmail: e.target.value })}
                    placeholder="tu@email.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="visitorPhone" className="text-sm">Teléfono (opcional)</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="visitorPhone"
                  type="tel"
                  value={formData.visitorPhone}
                  onChange={(e) => setFormData({ ...formData, visitorPhone: e.target.value })}
                  placeholder="+52 555 123 4567"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Mensaje */}
          <div className="space-y-2">
            <Label className="text-base font-medium">4. Mensaje adicional (opcional)</Label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Cuéntanos sobre tu interés en esta experiencia, preguntas que tengas, etc."
                className="pl-10 min-h-[80px]"
              />
            </div>
          </div>

          {/* Requerimientos especiales */}
          <div className="space-y-2">
            <Label htmlFor="specialRequirements" className="text-sm">Requerimientos especiales (opcional)</Label>
            <Textarea
              id="specialRequirements"
              value={formData.specialRequirements}
              onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
              placeholder="Alergias alimentarias, necesidades de accesibilidad, etc."
              className="min-h-[60px]"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={createReservation.isPending || !selectedDate || (availabilityCheck && !availabilityCheck.available)}
              className="bg-primary hover:bg-primary/90"
            >
              {createReservation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar Solicitud"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
