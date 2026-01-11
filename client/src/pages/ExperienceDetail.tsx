import { useState } from "react";
import { useParams, Link } from "wouter";
import Navbar from "@/components/Navbar";
import ReservationForm from "@/components/ReservationForm";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import { ReviewSection } from "@/components/ReviewSection";
import {
  MapPin,
  ArrowLeft,
  Share2,
  Heart,
  Phone,
  Mail,
  Globe,
  Users,
  Clock,
  Calendar,
  Mountain,
  TreePine,
  Compass,
  Leaf,
  ChevronRight,
  CheckCircle2,
  Star,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

const categories = [
  { value: "ecoturismo", label: "Ecoturismo", icon: TreePine },
  { value: "turismo_rural", label: "Turismo Rural", icon: Users },
  { value: "turismo_aventura", label: "Turismo de Aventura", icon: Compass },
  { value: "turismo_cultural", label: "Turismo Cultural", icon: Users },
  { value: "observacion_naturaleza", label: "Observación de Naturaleza", icon: Leaf },
  { value: "gastronomia", label: "Gastronomía", icon: Users },
];

const categoryIcons: Record<string, typeof Mountain> = {
  ecoturismo: TreePine,
  turismo_rural: Users,
  turismo_aventura: Compass,
  turismo_cultural: Users,
  observacion_naturaleza: Leaf,
  gastronomia: Users,
};

export default function ExperienceDetail() {
  const params = useParams<{ id: string }>();
  const experienceId = parseInt(params.id || "0", 10);

  const { data: experience, isLoading, error } = trpc.experiences.getById.useQuery(
    { id: experienceId },
    { enabled: experienceId > 0 }
  );

  const { data: relatedExperiences } = trpc.experiences.list.useQuery(
    { state: experience?.state, limit: 4 },
    { enabled: !!experience?.state }
  );

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: experience?.name,
        text: experience?.shortDescription || experience?.description || undefined,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Enlace copiado al portapapeles");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse space-y-4 w-full max-w-4xl px-4">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="aspect-video bg-muted rounded-xl" />
            <div className="h-4 bg-muted rounded w-2/3" />
            <div className="h-4 bg-muted rounded w-full" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <Mountain className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Experiencia no encontrada
            </h1>
            <p className="text-muted-foreground mb-6">
              La experiencia que buscas no existe o ha sido removida.
            </p>
            <Button asChild>
              <Link href="/geoportal">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Geoportal
              </Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const CategoryIcon = categoryIcons[experience.category || "ecoturismo"] || Mountain;
  const categoryInfo = categories.find(c => c.value === experience.category);
  const [showReservationForm, setShowReservationForm] = useState(false);

  const filteredRelated = relatedExperiences?.filter(e => e.id !== experience.id).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Breadcrumb */}
      <div className="border-b">
        <div className="container py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Inicio
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/geoportal" className="hover:text-foreground transition-colors">
              Geoportal
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium truncate max-w-[200px]">
              {experience.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Back Button */}
              <Button variant="ghost" size="sm" asChild>
                <Link href="/geoportal">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver al Geoportal
                </Link>
              </Button>

              {/* Header */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant="secondary">
                    <MapPin className="h-3 w-3 mr-1" />
                    {experience.state}
                  </Badge>
                  {experience.municipality && (
                    <Badge variant="outline">{experience.municipality}</Badge>
                  )}
                  {experience.isFeatured && (
                    <Badge className="bg-accent text-accent-foreground">
                      <Star className="h-3 w-3 mr-1" />
                      Destacado
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {experience.name}
                </h1>
                {experience.shortDescription && (
                  <p className="text-lg text-muted-foreground">
                    {experience.shortDescription}
                  </p>
                )}
              </div>

              {/* Image */}
              <div className="aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                {experience.imageUrl ? (
                  <img
                    src={experience.imageUrl}
                    alt={experience.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <CategoryIcon className="h-20 w-20 text-primary/40" />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartir
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast.info("Función próximamente disponible")}>
                  <Heart className="h-4 w-4 mr-2" />
                  Guardar
                </Button>
              </div>

              {/* Description */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    Descripción
                  </h2>
                  <div className="prose prose-sm max-w-none text-muted-foreground">
                    <p className="whitespace-pre-line leading-relaxed">
                      {experience.description || "Experiencia de turismo comunitario sostenible que ofrece una conexión auténtica con la naturaleza y la cultura local."}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Conservation Info Card */}
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Leaf className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Conservación de Biodiversidad
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Esta experiencia contribuye a la conservación de la biodiversidad local 
                        mediante prácticas de turismo sostenible y responsable.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews Section */}
              <ReviewSection 
                experienceId={experienceId} 
                experienceName={experience.name} 
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info Card */}
              <Card className="sticky top-24">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-foreground">Información</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <CategoryIcon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Categoría</p>
                        <p className="text-sm font-medium text-foreground">
                          {categoryInfo?.label || "Ecoturismo"}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Ubicación</p>
                        <p className="text-sm font-medium text-foreground">
                          {experience.municipality ? `${experience.municipality}, ` : ""}
                          {experience.state}
                        </p>
                      </div>
                    </div>

                    {experience.community && (
                      <>
                        <Separator />
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Comunidad</p>
                            <p className="text-sm font-medium text-foreground">
                              {experience.community}
                            </p>
                          </div>
                        </div>
                      </>
                    )}

                    {experience.latitude && experience.longitude && (
                      <>
                        <Separator />
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Globe className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Coordenadas</p>
                            <p className="text-sm font-medium text-foreground">
                              {experience.latitude}, {experience.longitude}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <Separator />

                  {/* Contact */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground text-sm">Contacto</h4>
                    
                    {experience.contactPhone && (
                      <a 
                        href={`tel:${experience.contactPhone}`}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        {experience.contactPhone}
                      </a>
                    )}
                    
                    {experience.contactEmail && (
                      <a 
                        href={`mailto:${experience.contactEmail}`}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                        {experience.contactEmail}
                      </a>
                    )}
                    
                    {experience.website && (
                      <a 
                        href={experience.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Sitio web
                      </a>
                    )}

                    {!experience.contactPhone && !experience.contactEmail && !experience.website && (
                      <p className="text-sm text-muted-foreground">
                        Contacta a través de nuestra plataforma
                      </p>
                    )}
                  </div>

                  <Button 
                    className="w-full bg-primary hover:bg-primary/90" 
                    onClick={() => setShowReservationForm(true)}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Solicitar Reservación
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/contacto">
                      Solicitar Información
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Reservation Form Modal */}
              <ReservationForm
                experienceId={experienceId}
                experienceName={experience.name}
                communityEmail={experience.contactEmail}
                communityPhone={experience.contactPhone}
                isOpen={showReservationForm}
                onClose={() => setShowReservationForm(false)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Related Experiences */}
      {filteredRelated && filteredRelated.length > 0 && (
        <section className="section-padding bg-muted/30">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Experiencias Relacionadas
                </h2>
                <p className="text-muted-foreground">
                  Otras experiencias en {experience.state}
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href={`/geoportal?state=${experience.state}`}>
                  Ver todas
                </Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRelated.map((exp) => {
                const ExpIcon = categoryIcons[exp.category || "ecoturismo"] || Mountain;
                return (
                  <Link key={exp.id} href={`/experiencia/${exp.id}`}>
                    <Card className="overflow-hidden hover-lift cursor-pointer group h-full">
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
                        {exp.imageUrl ? (
                          <img
                            src={exp.imageUrl}
                            alt={exp.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ExpIcon className="h-12 w-12 text-primary/40" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-5">
                        <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
                          {exp.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {exp.shortDescription || exp.description || "Experiencia de turismo comunitario"}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
