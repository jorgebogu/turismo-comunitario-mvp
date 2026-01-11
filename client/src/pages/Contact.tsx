import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Users,
  Award,
  GraduationCap,
  HelpCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

const contactTypes = [
  { value: "informacion_general", label: "Información General", icon: HelpCircle },
  { value: "registro_comunidad", label: "Registro de Comunidad", icon: Users },
  { value: "distintivo", label: "Solicitud de Distintivo", icon: Award },
  { value: "capacitacion", label: "Capacitación", icon: GraduationCap },
  { value: "otro", label: "Otro", icon: MessageSquare },
];

const mexicanStates = [
  "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas",
  "Chihuahua", "Ciudad de México", "Coahuila", "Colima", "Durango", "Estado de México",
  "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "Michoacán", "Morelos", "Nayarit",
  "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí",
  "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"
];

export default function Contact() {
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    organization: string;
    state: string;
    type: "informacion_general" | "registro_comunidad" | "distintivo" | "capacitacion" | "otro";
    message: string;
  }>({
    name: "",
    email: "",
    phone: "",
    organization: "",
    state: "",
    type: "informacion_general",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setIsSubmitted(true);
      toast.success("Mensaje enviado correctamente");
    },
    onError: (error) => {
      toast.error(error.message || "Error al enviar el mensaje");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <section className="flex-1 flex items-center justify-center py-16">
          <div className="container max-w-lg text-center">
            <div className="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-6">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              ¡Mensaje Enviado!
            </h1>
            <p className="text-muted-foreground mb-8">
              Gracias por contactarnos. Hemos recibido tu mensaje y nos 
              pondremos en contacto contigo a la brevedad posible.
            </p>
            <Button onClick={() => setIsSubmitted(false)}>
              Enviar otro mensaje
            </Button>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5 py-12 md:py-16">
        <div className="container">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <MessageSquare className="h-4 w-4" />
              Contacto
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              ¿Cómo podemos{" "}
              <span className="gradient-text">ayudarte?</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Estamos aquí para responder tus preguntas sobre turismo comunitario, 
              registro de comunidades, distintivos y capacitación.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información de Contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <a 
                    href="mailto:contacto@turismocomunitario.mx" 
                    className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Correo electrónico</p>
                      <p className="font-medium text-foreground">contacto@turismocomunitario.mx</p>
                    </div>
                  </a>
                  <a 
                    href="tel:+525555555555" 
                    className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Teléfono</p>
                      <p className="font-medium text-foreground">+52 55 5555 5555</p>
                    </div>
                  </a>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ubicación</p>
                      <p className="font-medium text-foreground">Ciudad de México, México</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tipos de Consulta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {contactTypes.map((type) => (
                    <div key={type.value} className="flex items-center gap-3">
                      <type.icon className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">{type.label}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Envíanos un mensaje</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre completo *</Label>
                        <Input
                          id="name"
                          placeholder="Tu nombre"
                          value={formData.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Correo electrónico *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="tu@email.com"
                          value={formData.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          id="phone"
                          placeholder="+52 55 1234 5678"
                          value={formData.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="organization">Organización / Comunidad</Label>
                        <Input
                          id="organization"
                          placeholder="Nombre de tu organización"
                          value={formData.organization}
                          onChange={(e) => handleChange("organization", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="state">Estado</Label>
                        <Select 
                          value={formData.state} 
                          onValueChange={(value) => handleChange("state", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona tu estado" />
                          </SelectTrigger>
                          <SelectContent>
                            {mexicanStates.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type">Tipo de consulta *</Label>
                        <Select 
                          value={formData.type} 
                          onValueChange={(value) => handleChange("type", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            {contactTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Mensaje *</Label>
                      <Textarea
                        id="message"
                        placeholder="Escribe tu mensaje aquí..."
                        rows={5}
                        value={formData.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full sm:w-auto"
                      disabled={submitMutation.isPending}
                    >
                      {submitMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Enviar Mensaje
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              Preguntas Frecuentes
            </h2>
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    ¿Cómo puedo registrar mi comunidad en la plataforma?
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Completa el formulario de contacto seleccionando "Registro de Comunidad" 
                    como tipo de consulta. Nuestro equipo te contactará con los requisitos 
                    y el proceso a seguir.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    ¿Cuáles son los requisitos para obtener un distintivo?
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Los requisitos varían según el nivel del distintivo. Visita nuestra 
                    sección de Distintivos para conocer los detalles completos o contáctanos 
                    para recibir orientación personalizada.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    ¿Los cursos del Campus Virtual tienen costo?
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    La mayoría de nuestros cursos son gratuitos para prestadores de servicios 
                    turísticos comunitarios registrados. Algunos cursos especializados pueden 
                    tener un costo simbólico.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
