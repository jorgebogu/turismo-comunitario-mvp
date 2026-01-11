import { useState, useMemo, useRef, useCallback, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { MapView } from "@/components/Map";
import { toast } from "sonner";
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
  Navigation,
  Locate,
  Loader2,
  Car,
  Bus,
  Footprints,
  Clock,
  Route,
  ExternalLink,
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

const distanceOptions = [
  { value: 50, label: "50 km" },
  { value: 100, label: "100 km" },
  { value: 200, label: "200 km" },
  { value: 500, label: "500 km" },
  { value: 1000, label: "1000 km" },
  { value: -1, label: "Sin límite" },
];

const travelModes = [
  { value: "DRIVING", label: "Auto", icon: Car },
  { value: "TRANSIT", label: "Transporte público", icon: Bus },
  { value: "WALKING", label: "Caminando", icon: Footprints },
];

// Función para calcular distancia entre dos puntos usando la fórmula de Haversine
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Formatear distancia para mostrar
function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${Math.round(km)} km`;
}

// Formatear duración
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours} h ${minutes} min`;
  }
  return `${minutes} min`;
}

interface UserLocation {
  lat: number;
  lng: number;
}

interface RouteInfo {
  distance: string;
  duration: string;
  durationValue: number;
  steps: Array<{
    instruction: string;
    distance: string;
    duration: string;
  }>;
}

interface ExperienceWithDistance {
  id: number;
  name: string;
  state: string;
  municipality: string | null;
  community: string | null;
  category: string | null;
  description: string | null;
  shortDescription: string | null;
  imageUrl: string | null;
  latitude: string | null;
  longitude: string | null;
  isFeatured: boolean | null;
  distance: number | null;
}

export default function Geoportal() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("map");
  const [selectedExperience, setSelectedExperience] = useState<number | null>(null);
  
  // Estados para geolocalización
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [useDistanceFilter, setUseDistanceFilter] = useState(false);
  const [maxDistance, setMaxDistance] = useState(100); // km
  const [sortByDistance, setSortByDistance] = useState(false);
  
  // Estados para rutas
  const [showRouteDialog, setShowRouteDialog] = useState(false);
  const [routeDestination, setRouteDestination] = useState<ExperienceWithDistance | null>(null);
  const [travelMode, setTravelMode] = useState<string>("DRIVING");
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [showRouteOnMap, setShowRouteOnMap] = useState(false);
  
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const userMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const circleRef = useRef<google.maps.Circle | null>(null);
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  const { data: experiences, isLoading } = trpc.experiences.list.useQuery({
    state: selectedState !== "all" ? selectedState : undefined,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
  });

  // Función para obtener la ubicación del usuario
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Tu navegador no soporta geolocalización");
      toast.error("Tu navegador no soporta geolocalización");
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(newLocation);
        setIsLocating(false);
        setUseDistanceFilter(true);
        setSortByDistance(true);
        toast.success("Ubicación obtenida correctamente");

        // Centrar el mapa en la ubicación del usuario
        if (mapRef.current) {
          mapRef.current.panTo(newLocation);
          mapRef.current.setZoom(8);
        }
      },
      (error) => {
        setIsLocating(false);
        let errorMessage = "Error al obtener ubicación";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Permiso de ubicación denegado";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Ubicación no disponible";
            break;
          case error.TIMEOUT:
            errorMessage = "Tiempo de espera agotado";
            break;
        }
        setLocationError(errorMessage);
        toast.error(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutos
      }
    );
  }, []);

  // Calcular distancias y filtrar experiencias
  const experiencesWithDistance = useMemo(() => {
    if (!experiences) return [];
    
    return experiences.map(exp => {
      let distance: number | null = null;
      if (userLocation && exp.latitude && exp.longitude) {
        distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          Number(exp.latitude),
          Number(exp.longitude)
        );
      }
      return { ...exp, distance };
    });
  }, [experiences, userLocation]);

  // Filtrar por búsqueda, distancia y ordenar
  const filteredExperiences = useMemo(() => {
    let result = experiencesWithDistance;
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (exp) =>
          exp.name.toLowerCase().includes(term) ||
          exp.state.toLowerCase().includes(term) ||
          exp.municipality?.toLowerCase().includes(term) ||
          exp.community?.toLowerCase().includes(term)
      );
    }
    
    // Filtrar por distancia
    if (useDistanceFilter && userLocation && maxDistance > 0) {
      result = result.filter(exp => {
        if (exp.distance === null) return false;
        return exp.distance <= maxDistance;
      });
    }
    
    // Ordenar por distancia si está activado
    if (sortByDistance && userLocation) {
      result = [...result].sort((a, b) => {
        if (a.distance === null && b.distance === null) return 0;
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
    }
    
    return result;
  }, [experiencesWithDistance, searchTerm, useDistanceFilter, userLocation, maxDistance, sortByDistance]);

  // Experiencias con coordenadas válidas
  const experiencesWithCoords = useMemo(() => {
    return filteredExperiences.filter(exp => exp.latitude && exp.longitude);
  }, [filteredExperiences]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedState("all");
    setSelectedCategory("all");
    setUseDistanceFilter(false);
    setSortByDistance(false);
  };

  const clearLocation = () => {
    setUserLocation(null);
    setUseDistanceFilter(false);
    setSortByDistance(false);
    setLocationError(null);
    clearRoute();
    
    // Remover marcador de usuario y círculo
    if (userMarkerRef.current) {
      userMarkerRef.current.map = null;
      userMarkerRef.current = null;
    }
    if (circleRef.current) {
      circleRef.current.setMap(null);
      circleRef.current = null;
    }
  };

  // Función para calcular ruta
  const calculateRoute = useCallback(async (destination: ExperienceWithDistance, mode: string) => {
    if (!userLocation || !destination.latitude || !destination.longitude) {
      toast.error("Se requiere tu ubicación para calcular la ruta");
      return;
    }

    if (!mapRef.current) {
      toast.error("El mapa no está disponible");
      return;
    }

    setIsCalculatingRoute(true);

    try {
      // Inicializar DirectionsService si no existe
      if (!directionsServiceRef.current) {
        directionsServiceRef.current = new google.maps.DirectionsService();
      }

      // Inicializar DirectionsRenderer si no existe
      if (!directionsRendererRef.current) {
        directionsRendererRef.current = new google.maps.DirectionsRenderer({
          map: mapRef.current,
          suppressMarkers: false,
          polylineOptions: {
            strokeColor: "#3b82f6",
            strokeWeight: 5,
            strokeOpacity: 0.8,
          },
        });
      } else {
        directionsRendererRef.current.setMap(mapRef.current);
      }

      const request: google.maps.DirectionsRequest = {
        origin: userLocation,
        destination: { lat: Number(destination.latitude), lng: Number(destination.longitude) },
        travelMode: mode as google.maps.TravelMode,
        unitSystem: google.maps.UnitSystem.METRIC,
        language: "es",
      };

      directionsServiceRef.current.route(request, (result, status) => {
        setIsCalculatingRoute(false);

        if (status === "OK" && result) {
          directionsRendererRef.current?.setDirections(result);
          setShowRouteOnMap(true);

          const route = result.routes[0];
          const leg = route.legs[0];

          // Extraer información de la ruta
          const steps = leg.steps.map(step => ({
            instruction: step.instructions.replace(/<[^>]*>/g, ''), // Remover HTML
            distance: step.distance?.text || '',
            duration: step.duration?.text || '',
          }));

          setRouteInfo({
            distance: leg.distance?.text || '',
            duration: leg.duration?.text || '',
            durationValue: leg.duration?.value || 0,
            steps,
          });

          toast.success("Ruta calculada correctamente");
        } else {
          let errorMessage = "No se pudo calcular la ruta";
          switch (status) {
            case "ZERO_RESULTS":
              errorMessage = "No se encontró una ruta disponible";
              break;
            case "NOT_FOUND":
              errorMessage = "Ubicación no encontrada";
              break;
            case "OVER_QUERY_LIMIT":
              errorMessage = "Límite de consultas excedido";
              break;
          }
          toast.error(errorMessage);
          setRouteInfo(null);
        }
      });
    } catch (error) {
      setIsCalculatingRoute(false);
      toast.error("Error al calcular la ruta");
      console.error("Error calculating route:", error);
    }
  }, [userLocation]);

  // Función para limpiar la ruta
  const clearRoute = useCallback(() => {
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setMap(null);
    }
    setShowRouteOnMap(false);
    setRouteInfo(null);
    setRouteDestination(null);
  }, []);

  // Función para abrir diálogo de ruta
  const openRouteDialog = useCallback((exp: ExperienceWithDistance) => {
    if (!userLocation) {
      toast.error("Primero activa tu ubicación para ver cómo llegar");
      return;
    }
    setRouteDestination(exp);
    setShowRouteDialog(true);
    calculateRoute(exp, travelMode);
  }, [userLocation, travelMode, calculateRoute]);

  // Función para abrir en Google Maps
  const openInGoogleMaps = useCallback(() => {
    if (!userLocation || !routeDestination?.latitude || !routeDestination?.longitude) return;
    
    const origin = `${userLocation.lat},${userLocation.lng}`;
    const destination = `${routeDestination.latitude},${routeDestination.longitude}`;
    const modeParam = travelMode === "DRIVING" ? "driving" : travelMode === "TRANSIT" ? "transit" : "walking";
    
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=${modeParam}`;
    window.open(url, '_blank');
  }, [userLocation, routeDestination, travelMode]);

  const hasActiveFilters = searchTerm || selectedState !== "all" || selectedCategory !== "all" || useDistanceFilter;

  // Crear marcador de usuario en el mapa
  const createUserMarker = useCallback((map: google.maps.Map) => {
    if (!userLocation) return;

    // Remover marcador anterior
    if (userMarkerRef.current) {
      userMarkerRef.current.map = null;
    }

    // Crear elemento personalizado para el marcador del usuario
    const userMarkerElement = document.createElement("div");
    userMarkerElement.innerHTML = `
      <div style="
        position: relative;
        width: 24px;
        height: 24px;
      ">
        <div style="
          position: absolute;
          width: 24px;
          height: 24px;
          background-color: #3b82f6;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        "></div>
        <div style="
          position: absolute;
          width: 40px;
          height: 40px;
          background-color: rgba(59, 130, 246, 0.2);
          border-radius: 50%;
          top: -8px;
          left: -8px;
          animation: pulse 2s infinite;
        "></div>
      </div>
      <style>
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
      </style>
    `;

    userMarkerRef.current = new google.maps.marker.AdvancedMarkerElement({
      map,
      position: userLocation,
      title: "Tu ubicación",
      content: userMarkerElement,
    });

    // Crear círculo de radio si está activo el filtro por distancia
    if (useDistanceFilter && maxDistance > 0 && !showRouteOnMap) {
      if (circleRef.current) {
        circleRef.current.setMap(null);
      }
      circleRef.current = new google.maps.Circle({
        map,
        center: userLocation,
        radius: maxDistance * 1000, // Convertir km a metros
        fillColor: "#3b82f6",
        fillOpacity: 0.1,
        strokeColor: "#3b82f6",
        strokeOpacity: 0.3,
        strokeWeight: 2,
      });
    }
  }, [userLocation, useDistanceFilter, maxDistance, showRouteOnMap]);

  // Actualizar círculo cuando cambia el radio
  useEffect(() => {
    if (showRouteOnMap) {
      // Ocultar círculo cuando se muestra la ruta
      if (circleRef.current) {
        circleRef.current.setMap(null);
      }
      return;
    }
    
    if (circleRef.current && userLocation) {
      if (useDistanceFilter && maxDistance > 0) {
        circleRef.current.setRadius(maxDistance * 1000);
        circleRef.current.setCenter(userLocation);
        circleRef.current.setMap(mapRef.current);
      } else {
        circleRef.current.setMap(null);
        circleRef.current = null;
      }
    } else if (mapRef.current && userLocation && useDistanceFilter && maxDistance > 0) {
      circleRef.current = new google.maps.Circle({
        map: mapRef.current,
        center: userLocation,
        radius: maxDistance * 1000,
        fillColor: "#3b82f6",
        fillOpacity: 0.1,
        strokeColor: "#3b82f6",
        strokeOpacity: 0.3,
        strokeWeight: 2,
      });
    }
  }, [userLocation, useDistanceFilter, maxDistance, showRouteOnMap]);

  // Función para crear marcadores en el mapa
  const createMarkers = useCallback((map: google.maps.Map) => {
    // Si se está mostrando una ruta, no recrear marcadores
    if (showRouteOnMap) return;
    
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

      // Contenido del InfoWindow con distancia y botón de ruta
      const distanceText = exp.distance !== null ? `<span style="font-size: 12px; color: #3b82f6; font-weight: 500;">📍 ${formatDistance(exp.distance)} de ti</span>` : '';
      const routeButton = userLocation ? `
        <button 
          onclick="window.dispatchEvent(new CustomEvent('openRoute', { detail: ${exp.id} }))"
          style="
            display: inline-flex;
            align-items: center;
            gap: 4px;
            background-color: #3b82f6;
            color: white;
            padding: 6px 12px;
            border-radius: 6px;
            border: none;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            margin-right: 8px;
          "
        >
          🧭 Cómo llegar
        </button>
      ` : '';
      
      const infoContent = `
        <div style="max-width: 300px; font-family: system-ui, sans-serif;">
          ${exp.imageUrl ? `
            <img src="${exp.imageUrl}" alt="${exp.name}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px 8px 0 0; margin: -8px -8px 8px -8px; width: calc(100% + 16px);" />
          ` : ''}
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1a1a1a;">${exp.name}</h3>
          <p style="margin: 0 0 8px 0; font-size: 13px; color: #666; line-height: 1.4;">
            ${exp.shortDescription || exp.description?.substring(0, 100) + '...' || 'Experiencia de turismo comunitario'}
          </p>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
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
            ${distanceText}
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${routeButton}
            <a href="/experiencia/${exp.id}" style="
              display: inline-block;
              background-color: #166534;
              color: white;
              padding: 6px 12px;
              border-radius: 6px;
              text-decoration: none;
              font-size: 12px;
              font-weight: 500;
            ">Ver detalles →</a>
          </div>
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

    // Crear marcador de usuario si hay ubicación
    createUserMarker(map);

    // Ajustar bounds del mapa para mostrar todos los marcadores
    if (experiencesWithCoords.length > 0 || userLocation) {
      const bounds = new google.maps.LatLngBounds();
      
      experiencesWithCoords.forEach(exp => {
        if (exp.latitude && exp.longitude) {
          bounds.extend({ lat: Number(exp.latitude), lng: Number(exp.longitude) });
        }
      });
      
      if (userLocation) {
        bounds.extend(userLocation);
      }
      
      map.fitBounds(bounds);
      
      // Si solo hay un marcador, establecer un zoom razonable
      if (experiencesWithCoords.length <= 1 && !userLocation) {
        map.setZoom(10);
      }
    }
  }, [experiencesWithCoords, userLocation, createUserMarker, showRouteOnMap]);

  // Escuchar evento de abrir ruta desde InfoWindow
  useEffect(() => {
    const handleOpenRoute = (event: CustomEvent) => {
      const expId = event.detail;
      const exp = experiencesWithCoords.find(e => e.id === expId);
      if (exp) {
        openRouteDialog(exp);
      }
    };

    window.addEventListener('openRoute', handleOpenRoute as EventListener);
    return () => {
      window.removeEventListener('openRoute', handleOpenRoute as EventListener);
    };
  }, [experiencesWithCoords, openRouteDialog]);

  // Callback cuando el mapa está listo
  const handleMapReady = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    createMarkers(map);
  }, [createMarkers]);

  // Actualizar marcadores cuando cambian las experiencias filtradas
  useEffect(() => {
    if (mapRef.current && viewMode === "map" && !showRouteOnMap) {
      createMarkers(mapRef.current);
    }
  }, [filteredExperiences, viewMode, createMarkers, userLocation, showRouteOnMap]);

  // Función para centrar el mapa en una experiencia
  const focusOnExperience = (exp: typeof filteredExperiences[0]) => {
    if (showRouteOnMap) {
      clearRoute();
    }
    
    if (mapRef.current && exp.latitude && exp.longitude) {
      mapRef.current.panTo({ lat: Number(exp.latitude), lng: Number(exp.longitude) });
      mapRef.current.setZoom(12);
      setSelectedExperience(exp.id);
      
      // Abrir InfoWindow del marcador
      const marker = markersRef.current.find(m => m.title === exp.name);
      if (marker && infoWindowRef.current) {
        const categoryColor = categoryColors[exp.category || "ecoturismo"] || "#166534";
        const distanceText = exp.distance !== null ? `<span style="font-size: 12px; color: #3b82f6; font-weight: 500;">📍 ${formatDistance(exp.distance)} de ti</span>` : '';
        const routeButton = userLocation ? `
          <button 
            onclick="window.dispatchEvent(new CustomEvent('openRoute', { detail: ${exp.id} }))"
            style="
              display: inline-flex;
              align-items: center;
              gap: 4px;
              background-color: #3b82f6;
              color: white;
              padding: 6px 12px;
              border-radius: 6px;
              border: none;
              font-size: 12px;
              font-weight: 500;
              cursor: pointer;
              margin-right: 8px;
            "
          >
            🧭 Cómo llegar
          </button>
        ` : '';
        
        const infoContent = `
          <div style="max-width: 300px; font-family: system-ui, sans-serif;">
            ${exp.imageUrl ? `
              <img src="${exp.imageUrl}" alt="${exp.name}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px 8px 0 0; margin: -8px -8px 8px -8px; width: calc(100% + 16px);" />
            ` : ''}
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1a1a1a;">${exp.name}</h3>
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #666; line-height: 1.4;">
              ${exp.shortDescription || exp.description?.substring(0, 100) + '...' || 'Experiencia de turismo comunitario'}
            </p>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
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
              ${distanceText}
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${routeButton}
              <a href="/experiencia/${exp.id}" style="
                display: inline-block;
                background-color: #166534;
                color: white;
                padding: 6px 12px;
                border-radius: 6px;
                text-decoration: none;
                font-size: 12px;
                font-weight: 500;
              ">Ver detalles →</a>
            </div>
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
              Filtra por estado, categoría o encuentra experiencias cercanas a ti.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-6 border-b bg-background sticky top-16 z-40">
        <div className="container">
          <div className="flex flex-col gap-4">
            {/* Primera fila de filtros */}
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
                {showRouteOnMap && (
                  <Button variant="outline" size="sm" onClick={clearRoute} className="text-blue-600">
                    <X className="h-4 w-4 mr-1" />
                    Cerrar ruta
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

            {/* Segunda fila - Geolocalización */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Button
                  variant={userLocation ? "secondary" : "outline"}
                  size="sm"
                  onClick={getUserLocation}
                  disabled={isLocating}
                  className="gap-2"
                >
                  {isLocating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Locate className="h-4 w-4" />
                  )}
                  {userLocation ? "Ubicación activa" : "Usar mi ubicación"}
                </Button>
                
                {userLocation && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearLocation}
                    className="text-muted-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {userLocation && (
                <>
                  <div className="h-6 w-px bg-border hidden sm:block" />
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Switch
                        id="distance-filter"
                        checked={useDistanceFilter}
                        onCheckedChange={setUseDistanceFilter}
                      />
                      <Label htmlFor="distance-filter" className="text-sm cursor-pointer">
                        Filtrar por distancia
                      </Label>
                    </div>
                    
                    {useDistanceFilter && (
                      <Select 
                        value={maxDistance.toString()} 
                        onValueChange={(v) => setMaxDistance(Number(v))}
                      >
                        <SelectTrigger className="w-[120px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {distanceOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value.toString()}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  <div className="h-6 w-px bg-border hidden sm:block" />

                  <div className="flex items-center gap-2">
                    <Switch
                      id="sort-distance"
                      checked={sortByDistance}
                      onCheckedChange={setSortByDistance}
                    />
                    <Label htmlFor="sort-distance" className="text-sm cursor-pointer">
                      Ordenar por cercanía
                    </Label>
                  </div>
                </>
              )}

              {locationError && (
                <span className="text-sm text-destructive">{locationError}</span>
              )}
            </div>

            {/* Active Filters */}
            {(hasActiveFilters || showRouteOnMap) && (
              <div className="flex flex-wrap gap-2">
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
                {useDistanceFilter && userLocation && (
                  <Badge variant="secondary" className="gap-1 bg-blue-100 text-blue-800">
                    <Navigation className="h-3 w-3" />
                    Dentro de {maxDistance > 0 ? `${maxDistance} km` : "cualquier distancia"}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setUseDistanceFilter(false)} />
                  </Badge>
                )}
                {showRouteOnMap && routeDestination && (
                  <Badge className="gap-1 bg-blue-500 text-white">
                    <Route className="h-3 w-3" />
                    Ruta a: {routeDestination.name}
                    <X className="h-3 w-3 cursor-pointer" onClick={clearRoute} />
                  </Badge>
                )}
              </div>
            )}
          </div>
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
                  {sortByDistance && userLocation && (
                    <span className="text-sm ml-2 text-blue-600">
                      • Ordenadas por cercanía
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
                {useDistanceFilter && userLocation 
                  ? `No hay experiencias dentro de ${maxDistance} km de tu ubicación. Intenta aumentar el radio de búsqueda.`
                  : "Intenta ajustar los filtros o buscar con otros términos."
                }
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
                  initialCenter={userLocation || { lat: 23.6345, lng: -102.5528 }}
                  initialZoom={userLocation ? 8 : 5}
                  onMapReady={handleMapReady}
                />
              </div>
              
              {/* Lista lateral */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                <h3 className="font-semibold text-foreground sticky top-0 bg-background py-2">
                  Experiencias ({filteredExperiences.length})
                  {sortByDistance && userLocation && (
                    <span className="text-sm font-normal text-blue-600 ml-2">
                      • Por cercanía
                    </span>
                  )}
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
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {exp.distance !== null && (
                              <span className="text-xs text-blue-600 flex items-center gap-1">
                                <Navigation className="h-3 w-3" />
                                {formatDistance(exp.distance)}
                              </span>
                            )}
                            {userLocation && hasCoords && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs text-blue-600 hover:text-blue-700"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openRouteDialog(exp);
                                }}
                              >
                                <Route className="h-3 w-3 mr-1" />
                                Ruta
                              </Button>
                            )}
                          </div>
                          {!hasCoords && (
                            <span className="text-xs text-amber-600">(Sin ubicación)</span>
                          )}
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
                const hasCoords = exp.latitude && exp.longitude;
                return (
                  <Card key={exp.id} className="overflow-hidden hover-lift cursor-pointer group h-full">
                    <Link href={`/experiencia/${exp.id}`}>
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
                        {exp.distance !== null && (
                          <div className="absolute bottom-3 right-3">
                            <Badge className="bg-blue-500 text-white gap-1">
                              <Navigation className="h-3 w-3" />
                              {formatDistance(exp.distance)}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </Link>
                    <CardContent className="p-5">
                      <Link href={`/experiencia/${exp.id}`}>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {exp.name}
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {exp.shortDescription || exp.description || "Experiencia de turismo comunitario"}
                        </p>
                      </Link>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          <CategoryIcon className="h-3 w-3 mr-1" />
                          {categories.find(c => c.value === exp.category)?.label || "Ecoturismo"}
                        </Badge>
                        <div className="flex items-center gap-2">
                          {userLocation && hasCoords && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs text-blue-600 hover:text-blue-700"
                              onClick={(e) => {
                                e.preventDefault();
                                openRouteDialog(exp);
                              }}
                            >
                              <Route className="h-3 w-3 mr-1" />
                              Ruta
                            </Button>
                          )}
                          <Link href={`/experiencia/${exp.id}`}>
                            <span className="text-primary text-sm font-medium flex items-center">
                              Ver más <ChevronRight className="h-4 w-4" />
                            </span>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* List View */}
          {!isLoading && filteredExperiences.length > 0 && viewMode === "list" && (
            <div className="space-y-4">
              {filteredExperiences.map((exp) => {
                const CategoryIcon = categoryIcons[exp.category || "ecoturismo"] || Mountain;
                const hasCoords = exp.latitude && exp.longitude;
                return (
                  <Card key={exp.id} className="overflow-hidden hover-lift cursor-pointer group">
                    <div className="flex flex-col sm:flex-row">
                      <Link href={`/experiencia/${exp.id}`} className="sm:w-48 md:w-64 flex-shrink-0">
                        <div className="aspect-video sm:aspect-square bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
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
                          {exp.distance !== null && (
                            <div className="absolute bottom-3 right-3">
                              <Badge className="bg-blue-500 text-white gap-1">
                                <Navigation className="h-3 w-3" />
                                {formatDistance(exp.distance)}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </Link>
                      <CardContent className="p-5 flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <Badge variant="secondary">{exp.state}</Badge>
                              {exp.isFeatured && (
                                <Badge className="bg-accent text-accent-foreground">Destacado</Badge>
                              )}
                              {exp.distance !== null && (
                                <Badge variant="outline" className="text-blue-600 border-blue-200 gap-1">
                                  <Navigation className="h-3 w-3" />
                                  {formatDistance(exp.distance)}
                                </Badge>
                              )}
                            </div>
                            <Link href={`/experiencia/${exp.id}`}>
                              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                                {exp.name}
                              </h3>
                              <p className="text-muted-foreground line-clamp-2 mb-3">
                                {exp.shortDescription || exp.description || "Experiencia de turismo comunitario"}
                              </p>
                            </Link>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
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
                              {userLocation && hasCoords && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 text-xs text-blue-600 border-blue-200 hover:bg-blue-50"
                                  onClick={() => openRouteDialog(exp)}
                                >
                                  <Route className="h-3 w-3 mr-1" />
                                  Cómo llegar
                                </Button>
                              )}
                            </div>
                          </div>
                          <Link href={`/experiencia/${exp.id}`}>
                            <Button variant="ghost" size="icon" className="hidden sm:flex">
                              <ChevronRight className="h-5 w-5" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Route Dialog */}
      <Dialog open={showRouteDialog} onOpenChange={setShowRouteDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Route className="h-5 w-5 text-blue-600" />
              Cómo llegar
            </DialogTitle>
            <DialogDescription>
              {routeDestination?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Selector de modo de transporte */}
            <div className="flex gap-2">
              {travelModes.map((mode) => {
                const Icon = mode.icon;
                return (
                  <Button
                    key={mode.value}
                    variant={travelMode === mode.value ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setTravelMode(mode.value);
                      if (routeDestination) {
                        calculateRoute(routeDestination, mode.value);
                      }
                    }}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {mode.label}
                  </Button>
                );
              })}
            </div>

            {/* Información de la ruta */}
            {isCalculatingRoute ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-muted-foreground">Calculando ruta...</span>
              </div>
            ) : routeInfo ? (
              <div className="space-y-4">
                {/* Resumen */}
                <div className="flex items-center gap-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Navigation className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Distancia</p>
                      <p className="font-semibold text-foreground">{routeInfo.distance}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Tiempo estimado</p>
                      <p className="font-semibold text-foreground">{routeInfo.duration}</p>
                    </div>
                  </div>
                </div>

                {/* Pasos de la ruta */}
                <div className="max-h-[200px] overflow-y-auto space-y-2">
                  <p className="text-sm font-medium text-foreground">Indicaciones:</p>
                  {routeInfo.steps.slice(0, 5).map((step, index) => (
                    <div key={index} className="flex gap-3 text-sm">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-foreground">{step.instruction}</p>
                        <p className="text-xs text-muted-foreground">{step.distance} • {step.duration}</p>
                      </div>
                    </div>
                  ))}
                  {routeInfo.steps.length > 5 && (
                    <p className="text-xs text-muted-foreground text-center">
                      +{routeInfo.steps.length - 5} pasos más
                    </p>
                  )}
                </div>

                {/* Botones de acción */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowRouteDialog(false);
                      setViewMode("map");
                    }}
                  >
                    <MapIcon className="h-4 w-4 mr-2" />
                    Ver en mapa
                  </Button>
                  <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={openInGoogleMaps}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Abrir en Google Maps
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Route className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p>No se pudo calcular la ruta</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
