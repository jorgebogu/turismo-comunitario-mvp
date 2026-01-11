import { useState, useMemo, useRef, useCallback } from "react";
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
import { MapView } from "@/components/Map";
import {
  Search,
  MapPin,
  Grid3X3,
  List,
  Mountain,
  TreePine,
  Compass,
  Users,
  Leaf,
  ChevronRight,
  X,
  Map as MapIcon,
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

const categoryColors: Record<string, string> = {
  ecoturismo: "#166534",
  turismo_rural: "#92400e",
  turismo_aventura: "#0369a1",
  turismo_cultural: "#7c3aed",
  observacion_naturaleza: "#15803d",
  gastronomia: "#dc2626",
};

export default function Geoportal() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("map");
  const [selectedExperience, setSelectedExperience] = useState<number | null>(null);
  
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

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

  // Experiencias con coordenadas válidas
  const experiencesWithCoords = useMemo(() => {
    return filteredExperiences.filter(exp => exp.latitude && exp.longitude);
  }, [filteredExperiences]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedState("all");
    setSelectedCategory("all");
  };

  const hasActiveFilters = searchTerm || selectedState !== "all" || selectedCategory !== "all";

  // Función para crear marcadores en el mapa
  const createMarkers = useCallback((map: google.maps.Map) => {
    // Limpiar marcadores existentes
    markersRef.current.forEach(marker => {
      marker.map = null;
    });
    markersRef.current = [];

    // Crear InfoWindow si no existe
    if (!infoWindowRef.current) {
      infoWindowRef.current = new google.maps.InfoWindow();
    }

    // Crear marcadores para cada experiencia
    experiencesWithCoords.forEach((exp) => {
      if (!exp.latitude || !exp.longitude) return;

      const categoryColor = categoryColors[exp.category || "ecoturismo"] || "#166534";
      
      // Crear elemento personalizado para el marcador
      const markerElement = document.createElement("div");
      markerElement.className = "custom-marker";
      markerElement.innerHTML = `
        <div style="
          background-color: ${categoryColor};
          width: 36px;
          height: 36px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          border: 2px solid white;
          cursor: pointer;
          transition: transform 0.2s;
        ">
          <div style="
            transform: rotate(45deg);
            color: white;
            font-size: 14px;
          ">
            📍
          </div>
        </div>
      `;

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: Number(exp.latitude), lng: Number(exp.longitude) },
        title: exp.name,
        content: markerElement,
      });

      // Contenido del InfoWindow
      const infoContent = `
        <div style="max-width: 280px; font-family: system-ui, sans-serif;">
          ${exp.imageUrl ? `
            <img src="${exp.imageUrl}" alt="${exp.name}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px 8px 0 0; margin: -8px -8px 8px -8px; width: calc(100% + 16px);" />
          ` : ''}
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1a1a1a;">${exp.name}</h3>
          <p style="margin: 0 0 8px 0; font-size: 13px; color: #666; line-height: 1.4;">
            ${exp.shortDescription || exp.description?.substring(0, 100) + '...' || 'Experiencia de turismo comunitario'}
          </p>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span style="
              background-color: ${categoryColor}20;
              color: ${categoryColor};
              padding: 2px 8px;
              border-radius: 12px;
              font-size: 11px;
              font-weight: 500;
            ">
              ${categories.find(c => c.value === exp.category)?.label || 'Ecoturismo'}
            </span>
            <span style="font-size: 12px; color: #888;">📍 ${exp.state}</span>
          </div>
          <a href="/experiencia/${exp.id}" style="
            display: inline-block;
            background-color: #166534;
            color: white;
            padding: 6px 16px;
            border-radius: 6px;
            text-decoration: none;
            font-size: 13px;
            font-weight: 500;
            margin-top: 4px;
          ">Ver detalles →</a>
        </div>
      `;

      marker.addListener("click", () => {
        if (infoWindowRef.current) {
          infoWindowRef.current.setContent(infoContent);
          infoWindowRef.current.open(map, marker);
          setSelectedExperience(exp.id);
        }
      });

      // Efecto hover
      markerElement.addEventListener("mouseenter", () => {
        markerElement.style.transform = "scale(1.1)";
      });
      markerElement.addEventListener("mouseleave", () => {
        markerElement.style.transform = "scale(1)";
      });

      markersRef.current.push(marker);
    });

    // Ajustar bounds del mapa para mostrar todos los marcadores
    if (experiencesWithCoords.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      experiencesWithCoords.forEach(exp => {
        if (exp.latitude && exp.longitude) {
          bounds.extend({ lat: Number(exp.latitude), lng: Number(exp.longitude) });
        }
      });
      map.fitBounds(bounds);
      
      // Si solo hay un marcador, establecer un zoom razonable
      if (experiencesWithCoords.length === 1) {
        map.setZoom(10);
      }
    }
  }, [experiencesWithCoords]);

  // Callback cuando el mapa está listo
  const handleMapReady = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    createMarkers(map);
  }, [createMarkers]);

  // Actualizar marcadores cuando cambian las experiencias filtradas
  useMemo(() => {
    if (mapRef.current && viewMode === "map") {
      createMarkers(mapRef.current);
    }
  }, [filteredExperiences, viewMode, createMarkers]);

  // Función para centrar el mapa en una experiencia
  const focusOnExperience = (exp: typeof filteredExperiences[0]) => {
    if (mapRef.current && exp.latitude && exp.longitude) {
      mapRef.current.panTo({ lat: Number(exp.latitude), lng: Number(exp.longitude) });
      mapRef.current.setZoom(12);
      setSelectedExperience(exp.id);
      
      // Abrir InfoWindow del marcador
      const marker = markersRef.current.find(m => m.title === exp.name);
      if (marker && infoWindowRef.current) {
        const categoryColor = categoryColors[exp.category || "ecoturismo"] || "#166534";
        const infoContent = `
          <div style="max-width: 280px; font-family: system-ui, sans-serif;">
            ${exp.imageUrl ? `
              <img src="${exp.imageUrl}" alt="${exp.name}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px 8px 0 0; margin: -8px -8px 8px -8px; width: calc(100% + 16px);" />
            ` : ''}
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1a1a1a;">${exp.name}</h3>
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #666; line-height: 1.4;">
              ${exp.shortDescription || exp.description?.substring(0, 100) + '...' || 'Experiencia de turismo comunitario'}
            </p>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <span style="
                background-color: ${categoryColor}20;
                color: ${categoryColor};
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 500;
              ">
                ${categories.find(c => c.value === exp.category)?.label || 'Ecoturismo'}
              </span>
              <span style="font-size: 12px; color: #888;">📍 ${exp.state}</span>
            </div>
            <a href="/experiencia/${exp.id}" style="
              display: inline-block;
              background-color: #166534;
              color: white;
              padding: 6px 16px;
              border-radius: 6px;
              text-decoration: none;
              font-size: 13px;
              font-weight: 500;
              margin-top: 4px;
            ">Ver detalles →</a>
          </div>
        `;
        infoWindowRef.current.setContent(infoContent);
        infoWindowRef.current.open(mapRef.current, marker);
      }
    }
  };

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
                  variant={viewMode === "map" ? "secondary" : "ghost"}
                  size="icon"
                  className="rounded-r-none"
                  onClick={() => setViewMode("map")}
                  title="Vista de mapa"
                >
                  <MapIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="rounded-none border-x"
                  onClick={() => setViewMode("grid")}
                  title="Vista de cuadrícula"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="rounded-l-none"
                  onClick={() => setViewMode("list")}
                  title="Vista de lista"
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
                  {viewMode === "map" && experiencesWithCoords.length < filteredExperiences.length && (
                    <span className="text-sm ml-2">
                      ({experiencesWithCoords.length} con ubicación en mapa)
                    </span>
                  )}
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

          {/* Map View */}
          {!isLoading && filteredExperiences.length > 0 && viewMode === "map" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Mapa */}
              <div className="lg:col-span-2 rounded-xl overflow-hidden border shadow-sm">
                <MapView
                  className="h-[500px] lg:h-[600px]"
                  initialCenter={{ lat: 23.6345, lng: -102.5528 }} // Centro de México
                  initialZoom={5}
                  onMapReady={handleMapReady}
                />
              </div>
              
              {/* Lista lateral */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                <h3 className="font-semibold text-foreground sticky top-0 bg-background py-2">
                  Experiencias ({filteredExperiences.length})
                </h3>
                {filteredExperiences.map((exp) => {
                  const CategoryIcon = categoryIcons[exp.category || "ecoturismo"] || Mountain;
                  const hasCoords = exp.latitude && exp.longitude;
                  return (
                    <Card 
                      key={exp.id} 
                      className={`overflow-hidden cursor-pointer transition-all ${
                        selectedExperience === exp.id 
                          ? 'ring-2 ring-primary shadow-md' 
                          : 'hover:shadow-md'
                      } ${!hasCoords ? 'opacity-60' : ''}`}
                      onClick={() => hasCoords ? focusOnExperience(exp) : null}
                    >
                      <div className="flex">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden flex-shrink-0">
                          {exp.imageUrl ? (
                            <img
                              src={exp.imageUrl}
                              alt={exp.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <CategoryIcon className="h-6 w-6 text-primary/40" />
                            </div>
                          )}
                        </div>
                        <CardContent className="p-3 flex-1">
                          <h4 className="font-medium text-sm text-foreground line-clamp-1 mb-1">
                            {exp.name}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {exp.state}
                            {!hasCoords && (
                              <span className="text-amber-600">(Sin ubicación)</span>
                            )}
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  );
                })}
              </div>
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
