import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import {
  BookOpen,
  FileText,
  Video,
  Image,
  Download,
  Search,
  ExternalLink,
  Clock,
  User,
  FileDown,
  Scale,
  Lightbulb,
} from "lucide-react";

const resourceTypes = [
  { value: "all", label: "Todos", icon: BookOpen },
  { value: "guia", label: "Guías", icon: BookOpen },
  { value: "manual", label: "Manuales", icon: FileText },
  { value: "infografia", label: "Infografías", icon: Image },
  { value: "video", label: "Videos", icon: Video },
  { value: "documento", label: "Documentos", icon: FileText },
  { value: "normativa", label: "Normativa", icon: Scale },
];

const resourceCategories = [
  "Turismo Comunitario",
  "Conservación de Biodiversidad",
  "Gestión Comunitaria",
  "Comercialización",
  "Patrimonio Biocultural",
  "Normatividad",
];

const typeIcons: Record<string, typeof BookOpen> = {
  guia: BookOpen,
  manual: FileText,
  infografia: Image,
  video: Video,
  documento: FileText,
  normativa: Scale,
};

export default function ContentCenter() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: resources, isLoading } = trpc.resources.list.useQuery({
    type: selectedType !== "all" ? selectedType : undefined,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
  });

  const downloadMutation = trpc.resources.download.useMutation();

  const handleDownload = async (id: number) => {
    const resource = await downloadMutation.mutateAsync({ id });
    if (resource?.fileUrl) {
      window.open(resource.fileUrl, "_blank");
    }
  };

  const filteredResources = resources?.filter((r) =>
    searchTerm
      ? r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description?.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-500/10 via-background to-primary/5 py-12 md:py-16">
        <div className="container">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 text-sm font-medium mb-4">
              <BookOpen className="h-4 w-4" />
              Centro de Contenido Inteligente
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Recursos para el{" "}
              <span className="gradient-text">Turismo Sostenible</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Accede a guías, manuales, infografías y documentos normativos 
              para fortalecer tu proyecto de turismo comunitario.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="py-8 border-b">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="hover-lift cursor-pointer" onClick={() => setSelectedType("guia")}>
              <CardContent className="p-4 text-center">
                <div className="inline-flex p-3 rounded-xl bg-emerald-500/10 text-emerald-600 mb-2">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="font-medium text-foreground">Guías</h3>
                <p className="text-sm text-muted-foreground">Paso a paso</p>
              </CardContent>
            </Card>
            <Card className="hover-lift cursor-pointer" onClick={() => setSelectedType("manual")}>
              <CardContent className="p-4 text-center">
                <div className="inline-flex p-3 rounded-xl bg-blue-500/10 text-blue-600 mb-2">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="font-medium text-foreground">Manuales</h3>
                <p className="text-sm text-muted-foreground">Documentación</p>
              </CardContent>
            </Card>
            <Card className="hover-lift cursor-pointer" onClick={() => setSelectedType("video")}>
              <CardContent className="p-4 text-center">
                <div className="inline-flex p-3 rounded-xl bg-purple-500/10 text-purple-600 mb-2">
                  <Video className="h-6 w-6" />
                </div>
                <h3 className="font-medium text-foreground">Videos</h3>
                <p className="text-sm text-muted-foreground">Multimedia</p>
              </CardContent>
            </Card>
            <Card className="hover-lift cursor-pointer" onClick={() => setSelectedType("normativa")}>
              <CardContent className="p-4 text-center">
                <div className="inline-flex p-3 rounded-xl bg-amber-500/10 text-amber-600 mb-2">
                  <Scale className="h-6 w-6" />
                </div>
                <h3 className="font-medium text-foreground">Normativa</h3>
                <p className="text-sm text-muted-foreground">Regulaciones</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Filters & Content */}
      <section className="section-padding flex-1">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Buscar
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar recursos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Tipo de recurso
                  </label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {resourceTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <span className="flex items-center gap-2">
                            <type.icon className="h-4 w-4" />
                            {type.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Categoría
                  </label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las categorías</SelectItem>
                      {resourceCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear Filters */}
                {(selectedType !== "all" || selectedCategory !== "all" || searchTerm) && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSelectedType("all");
                      setSelectedCategory("all");
                      setSearchTerm("");
                    }}
                  >
                    Limpiar filtros
                  </Button>
                )}
              </div>
            </aside>

            {/* Resources Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  {isLoading ? (
                    "Cargando recursos..."
                  ) : (
                    <>
                      <span className="font-medium text-foreground">
                        {filteredResources?.length || 0}
                      </span>{" "}
                      recursos disponibles
                    </>
                  )}
                </p>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="grid gap-4">
                  {[...Array(4)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 bg-muted rounded-lg" />
                          <div className="flex-1">
                            <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                            <div className="h-4 bg-muted rounded w-full mb-1" />
                            <div className="h-4 bg-muted rounded w-2/3" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!isLoading && (!filteredResources || filteredResources.length === 0) && (
                <div className="text-center py-16">
                  <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No se encontraron recursos
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Próximamente agregaremos más contenido. ¡Vuelve pronto!
                  </p>
                </div>
              )}

              {/* Resources List */}
              {!isLoading && filteredResources && filteredResources.length > 0 && (
                <div className="grid gap-4">
                  {filteredResources.map((resource) => {
                    const TypeIcon = typeIcons[resource.type || "documento"] || FileText;
                    return (
                      <Card key={resource.id} className="hover-lift">
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                <TypeIcon className="h-6 w-6 text-primary" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <h3 className="font-semibold text-foreground mb-1">
                                    {resource.title}
                                  </h3>
                                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                    {resource.description || "Recurso educativo para turismo comunitario"}
                                  </p>
                                  <div className="flex flex-wrap items-center gap-3 text-sm">
                                    {resource.category && (
                                      <Badge variant="secondary">{resource.category}</Badge>
                                    )}
                                    {resource.author && (
                                      <span className="flex items-center gap-1 text-muted-foreground">
                                        <User className="h-3 w-3" />
                                        {resource.author}
                                      </span>
                                    )}
                                    {resource.downloadCount !== null && resource.downloadCount > 0 && (
                                      <span className="flex items-center gap-1 text-muted-foreground">
                                        <Download className="h-3 w-3" />
                                        {resource.downloadCount} descargas
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDownload(resource.id)}
                                  disabled={!resource.fileUrl}
                                >
                                  <FileDown className="h-4 w-4 mr-2" />
                                  Descargar
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 bg-muted/50">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  Contenido Inteligente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Nuestro centro de contenido utiliza inteligencia artificial para 
                  generar guías de viaje, artículos descriptivos y recomendaciones 
                  personalizadas basadas en las experiencias turísticas comunitarias.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-primary" />
                  Marco Normativo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Accede a documentos oficiales, lineamientos y normativas relacionadas 
                  con el turismo comunitario sostenible y la conservación de la 
                  biodiversidad en México.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
