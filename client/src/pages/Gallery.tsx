import { useState, useMemo } from "react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import {
  Image,
  MapPin,
  ChevronRight,
  X,
  ExternalLink,
  Mountain,
  TreePine,
  Compass,
  Users,
  Leaf,
  Camera,
} from "lucide-react";

const categories = [
  { value: "all", label: "Todas las categorías" },
  { value: "ecoturismo", label: "Ecoturismo" },
  { value: "turismo_rural", label: "Turismo Rural" },
  { value: "turismo_aventura", label: "Turismo de Aventura" },
  { value: "turismo_cultural", label: "Turismo Cultural" },
  { value: "observacion_naturaleza", label: "Observación de Naturaleza" },
  { value: "gastronomia", label: "Gastronomía" },
];

const mexicanStates = [
  "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas",
  "Chihuahua", "Ciudad de México", "Coahuila", "Colima", "Durango", "Estado de México",
  "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "Michoacán", "Morelos", "Nayarit",
  "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí",
  "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"
];

const categoryIcons: Record<string, typeof Mountain> = {
  ecoturismo: TreePine,
  turismo_rural: Users,
  turismo_aventura: Compass,
  turismo_cultural: Users,
  observacion_naturaleza: Leaf,
  gastronomia: Users,
};

type Experience = {
  id: number;
  name: string;
  description: string | null;
  shortDescription: string | null;
  state: string;
  municipality: string | null;
  community: string | null;
  category: string | null;
  imageUrl: string | null;
  isFeatured: boolean | null;
};

export default function Gallery() {
  const [selectedState, setSelectedState] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);

  const { data: experiences, isLoading } = trpc.experiences.list.useQuery({
    state: selectedState !== "all" ? selectedState : undefined,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
  });

  const filteredExperiences = useMemo(() => {
    return experiences || [];
  }, [experiences]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-accent/10 via-background to-primary/5 py-12 md:py-16">
        <div className="container">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium mb-4">
              <Camera className="h-4 w-4" />
              Galería de Experiencias
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Descubre la{" "}
              <span className="gradient-text">Riqueza de México</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Explora las experiencias turísticas comunitarias que celebran 
              la biodiversidad y cultura de nuestro país.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b sticky top-16 z-40 bg-background">
        <div className="container">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                {mexicanStates.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[220px]">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(selectedState !== "all" || selectedCategory !== "all") && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSelectedState("all");
                  setSelectedCategory("all");
                }}
              >
                <X className="h-4 w-4 mr-1" />
                Limpiar filtros
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section-padding flex-1">
        <div className="container">
          {/* Results Count */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              {isLoading ? (
                "Cargando experiencias..."
              ) : (
                <>
                  <span className="font-medium text-foreground">{filteredExperiences.length}</span>{" "}
                  experiencias en la galería
                </>
              )}
            </p>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredExperiences.length === 0 && (
            <div className="text-center py-16">
              <Image className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No hay experiencias disponibles
              </h3>
              <p className="text-muted-foreground mb-6">
                Próximamente agregaremos más contenido visual. ¡Vuelve pronto!
              </p>
              <Button asChild>
                <Link href="/contacto">
                  Registrar mi Experiencia
                </Link>
              </Button>
            </div>
          )}

          {/* Gallery Grid */}
          {!isLoading && filteredExperiences.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredExperiences.map((exp) => {
                const CategoryIcon = categoryIcons[exp.category || "ecoturismo"] || Mountain;
                return (
                  <div
                    key={exp.id}
                    className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer hover-lift"
                    onClick={() => setSelectedExperience(exp)}
                  >
                    {exp.imageUrl ? (
                      <img
                        src={exp.imageUrl}
                        alt={exp.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <CategoryIcon className="h-16 w-16 text-primary/40" />
                      </div>
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-semibold mb-1 line-clamp-1">
                          {exp.name}
                        </h3>
                        <div className="flex items-center gap-2 text-white/80 text-sm">
                          <MapPin className="h-3 w-3" />
                          {exp.state}
                        </div>
                      </div>
                    </div>

                    {/* Featured Badge */}
                    {exp.isFeatured && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-accent text-accent-foreground">
                          Destacado
                        </Badge>
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="bg-background/90 backdrop-blur">
                        <CategoryIcon className="h-3 w-3 mr-1" />
                        {categories.find(c => c.value === exp.category)?.label || "Ecoturismo"}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Experience Detail Modal */}
      <Dialog open={!!selectedExperience} onOpenChange={() => setSelectedExperience(null)}>
        <DialogContent className="max-w-2xl">
          {selectedExperience && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedExperience.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                  {selectedExperience.imageUrl ? (
                    <img
                      src={selectedExperience.imageUrl}
                      alt={selectedExperience.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <Mountain className="h-16 w-16 text-primary/40" />
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    <MapPin className="h-3 w-3 mr-1" />
                    {selectedExperience.state}
                  </Badge>
                  {selectedExperience.municipality && (
                    <Badge variant="outline">{selectedExperience.municipality}</Badge>
                  )}
                  {selectedExperience.category && (
                    <Badge variant="outline">
                      {categories.find(c => c.value === selectedExperience.category)?.label}
                    </Badge>
                  )}
                </div>

                <p className="text-muted-foreground">
                  {selectedExperience.description || selectedExperience.shortDescription || "Experiencia de turismo comunitario sostenible."}
                </p>

                <div className="flex gap-3">
                  <Button asChild className="flex-1">
                    <Link href={`/experiencia/${selectedExperience.id}`}>
                      Ver Detalles Completos
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedExperience(null)}>
                    Cerrar
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* CTA */}
      <section className="py-12 bg-muted/50">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <Camera className="h-10 w-10 mx-auto text-primary mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-3">
              ¿Tienes una experiencia que compartir?
            </h2>
            <p className="text-muted-foreground mb-6">
              Registra tu comunidad y comparte las experiencias turísticas 
              que ofreces con viajeros de todo el mundo.
            </p>
            <Button asChild>
              <Link href="/contacto">
                Registrar mi Comunidad
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
