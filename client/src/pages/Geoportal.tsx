import { useState, useMemo } from "react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import {
  Search,
  MapPin,
  Filter,
  Grid3X3,
  List,
  Mountain,
  TreePine,
  Compass,
  Users,
  Leaf,
  ChevronRight,
  X,
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

export default function Geoportal() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: experiences, isLoading } = trpc.experiences.list.useQuery({
    state: selectedState !== "all" ? selectedState : undefined,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
  });

  const filteredExperiences = useMemo(() => {
    if (!experiences) return [];
    if (!searchTerm) return experiences;
    
    const term = searchTerm.toLowerCase();
    return experiences.filter(
      (exp) =>
        exp.name.toLowerCase().includes(term) ||
        exp.state.toLowerCase().includes(term) ||
        exp.municipality?.toLowerCase().includes(term) ||
        exp.community?.toLowerCase().includes(term)
    );
  }, [experiences, searchTerm]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedState("all");
    setSelectedCategory("all");
  };

  const hasActiveFilters = searchTerm || selectedState !== "all" || selectedCategory !== "all";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5 py-12 md:py-16">
        <div className="container">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <MapPin className="h-4 w-4" />
              Geoportal Interactivo
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Explora Experiencias de{" "}
              <span className="gradient-text">Turismo Comunitario</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Descubre destinos turísticos comunitarios en todo México. 
              Filtra por estado, categoría o busca por nombre.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-6 border-b bg-background sticky top-16 z-40">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar experiencias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* State Filter */}
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="w-full lg:w-[200px]">
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

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-[220px]">
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

            {/* View Toggle & Clear */}
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Limpiar
                </Button>
              )}
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="rounded-r-none"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="rounded-l-none"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4">
              {searchTerm && (
                <Badge variant="secondary" className="gap-1">
                  Búsqueda: {searchTerm}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchTerm("")} />
                </Badge>
              )}
              {selectedState !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Estado: {selectedState}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedState("all")} />
                </Badge>
              )}
              {selectedCategory !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Categoría: {categories.find(c => c.value === selectedCategory)?.label}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory("all")} />
                </Badge>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Results Section */}
      <section className="section-padding flex-1">
        <div className="container">
          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              {isLoading ? (
                "Cargando experiencias..."
              ) : (
                <>
                  <span className="font-medium text-foreground">{filteredExperiences.length}</span>{" "}
                  experiencias encontradas
                </>
              )}
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <div className="aspect-video bg-muted" />
                  <CardContent className="p-5">
                    <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-4 bg-muted rounded w-full mb-1" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredExperiences.length === 0 && (
            <div className="text-center py-16">
              <MapPin className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No se encontraron experiencias
              </h3>
              <p className="text-muted-foreground mb-6">
                Intenta ajustar los filtros o buscar con otros términos.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            </div>
          )}

          {/* Grid View */}
          {!isLoading && filteredExperiences.length > 0 && viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExperiences.map((exp) => {
                const CategoryIcon = categoryIcons[exp.category || "ecoturismo"] || Mountain;
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
                            <CategoryIcon className="h-12 w-12 text-primary/40" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3 flex gap-2">
                          <Badge variant="secondary" className="bg-background/90 backdrop-blur">
                            {exp.state}
                          </Badge>
                        </div>
                        {exp.isFeatured && (
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-accent text-accent-foreground">
                              Destacado
                            </Badge>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {exp.name}
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {exp.shortDescription || exp.description || "Experiencia de turismo comunitario"}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            <CategoryIcon className="h-3 w-3 mr-1" />
                            {categories.find(c => c.value === exp.category)?.label || "Ecoturismo"}
                          </Badge>
                          <span className="text-primary text-sm font-medium flex items-center">
                            Ver más <ChevronRight className="h-4 w-4" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}

          {/* List View */}
          {!isLoading && filteredExperiences.length > 0 && viewMode === "list" && (
            <div className="space-y-4">
              {filteredExperiences.map((exp) => {
                const CategoryIcon = categoryIcons[exp.category || "ecoturismo"] || Mountain;
                return (
                  <Link key={exp.id} href={`/experiencia/${exp.id}`}>
                    <Card className="overflow-hidden hover-lift cursor-pointer group">
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-48 md:w-64 aspect-video sm:aspect-square bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden flex-shrink-0">
                          {exp.imageUrl ? (
                            <img
                              src={exp.imageUrl}
                              alt={exp.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <CategoryIcon className="h-10 w-10 text-primary/40" />
                            </div>
                          )}
                        </div>
                        <CardContent className="p-5 flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="secondary">{exp.state}</Badge>
                                {exp.isFeatured && (
                                  <Badge className="bg-accent text-accent-foreground">Destacado</Badge>
                                )}
                              </div>
                              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                                {exp.name}
                              </h3>
                              <p className="text-muted-foreground line-clamp-2 mb-3">
                                {exp.shortDescription || exp.description || "Experiencia de turismo comunitario"}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                {exp.municipality && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {exp.municipality}
                                  </span>
                                )}
                                <Badge variant="outline" className="text-xs">
                                  <CategoryIcon className="h-3 w-3 mr-1" />
                                  {categories.find(c => c.value === exp.category)?.label || "Ecoturismo"}
                                </Badge>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="hidden sm:flex">
                              <ChevronRight className="h-5 w-5" />
                            </Button>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
