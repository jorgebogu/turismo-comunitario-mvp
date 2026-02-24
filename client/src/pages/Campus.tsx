import { useState } from "react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import {
  GraduationCap,
  Clock,
  Users,
  Award,
  BookOpen,
  Video,
  FileText,
  Play,
  ChevronRight,
  Star,
  Target,
  Lightbulb,
} from "lucide-react";

const courseCategories = [
  "Turismo Comunitario",
  "Conservación de Biodiversidad",
  "Gestión Empresarial",
  "Patrimonio Biocultural",
  "Marketing Digital",
  "Atención al Cliente",
];

const courseLevels = [
  { value: "basico", label: "Básico", color: "bg-green-500/10 text-green-600" },
  { value: "intermedio", label: "Intermedio", color: "bg-amber-500/10 text-amber-600" },
  { value: "avanzado", label: "Avanzado", color: "bg-purple-500/10 text-purple-600" },
];

const features = [
  {
    icon: Video,
    title: "Videos de Expertos",
    description: "Cursos impartidos por especialistas en turismo comunitario",
  },
  {
    icon: FileText,
    title: "Material Descargable",
    description: "Temarios, bibliografía y recursos complementarios",
  },
  {
    icon: Award,
    title: "Certificados",
    description: "Obtén constancias al completar cada curso",
  },
  {
    icon: Users,
    title: "Foro de Discusión",
    description: "Conecta con otros prestadores de servicios",
  },
];

export default function Campus() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");

  const { data: courses, isLoading } = trpc.courses.list.useQuery({
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    level: selectedLevel !== "all" ? selectedLevel : undefined,
  });

  const { data: featuredCourses } = trpc.courses.getFeatured.useQuery({ limit: 3 });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title="Campus Virtual"
        description="Cursos y capacitaciones en línea sobre turismo comunitario, ecoturismo y gestión sostenible de destinos turísticos en México."
        keywords="campus virtual, cursos turismo comunitario, capacitación ecoturismo, formación turismo sostenible"
      />
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-500/10 via-background to-primary/5 py-12 md:py-16">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 text-sm font-medium mb-4">
                <GraduationCap className="h-4 w-4" />
                Campus Virtual
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Capacitación para el{" "}
                <span className="gradient-text">Turismo Comunitario</span>
              </h1>
              <p className="text-muted-foreground text-lg mb-6">
                Fortalece tus capacidades con cursos especializados en turismo 
                comunitario, conservación de biodiversidad y gestión empresarial.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg">
                  <Play className="h-4 w-4 mr-2" />
                  Explorar Cursos
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/contacto">
                    Solicitar Información
                  </Link>
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <Card key={index} className="hover-lift">
                    <CardContent className="p-4">
                      <div className="inline-flex p-2 rounded-lg bg-primary/10 text-primary mb-2">
                        <feature.icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-medium text-foreground text-sm mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 border-b">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-1">15+</div>
              <div className="text-sm text-muted-foreground">Cursos Disponibles</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-1">50+</div>
              <div className="text-sm text-muted-foreground">Horas de Contenido</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-1">20+</div>
              <div className="text-sm text-muted-foreground">Expertos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-1">500+</div>
              <div className="text-sm text-muted-foreground">Participantes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      {featuredCourses && featuredCourses.length > 0 && (
        <section className="section-padding bg-muted/30">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Cursos Destacados
                </h2>
                <p className="text-muted-foreground">
                  Los cursos más populares de nuestra plataforma
                </p>
              </div>
              <Badge variant="secondary" className="gap-1">
                <Star className="h-3 w-3" />
                Recomendados
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map((course) => {
                const levelInfo = courseLevels.find(l => l.value === course.level);
                return (
                  <Link key={course.id} href={`/curso/${course.id}`}>
                  <Card className="overflow-hidden hover-lift group cursor-pointer">
                    <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-primary/20 relative">
                      {course.imageUrl ? (
                        <img
                          src={course.imageUrl}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <GraduationCap className="h-12 w-12 text-primary/40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="secondary" size="sm">
                          <Play className="h-4 w-4 mr-2" />
                          Ver Curso
                        </Button>
                      </div>
                      {course.isFeatured && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-accent text-accent-foreground">
                            <Star className="h-3 w-3 mr-1" />
                            Destacado
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        {levelInfo && (
                          <Badge variant="secondary" className={levelInfo.color}>
                            {levelInfo.label}
                          </Badge>
                        )}
                        {course.category && (
                          <Badge variant="outline">{course.category}</Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {course.shortDescription || course.description}
                      </p>
                      {course.duration && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          {course.duration}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* All Courses */}
      <section className="section-padding">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Catálogo de Cursos
              </h2>
              <p className="text-muted-foreground">
                Explora todos nuestros cursos disponibles
              </p>
            </div>
            <div className="flex gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {courseCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Nivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los niveles</SelectItem>
                  {courseLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-video bg-muted" />
                  <CardContent className="p-5">
                    <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                    <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-4 bg-muted rounded w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && (!courses || courses.length === 0) && (
            <div className="text-center py-16">
              <GraduationCap className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Próximamente más cursos
              </h3>
              <p className="text-muted-foreground mb-6">
                Estamos preparando contenido especializado para ti. 
                ¡Regístrate para recibir notificaciones!
              </p>
              <Button asChild>
                <Link href="/contacto">
                  Recibir Notificaciones
                </Link>
              </Button>
            </div>
          )}

          {/* Courses Grid */}
          {!isLoading && courses && courses.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => {
                const levelInfo = courseLevels.find(l => l.value === course.level);
                return (
                  <Link key={course.id} href={`/curso/${course.id}`}>
                  <Card className="overflow-hidden hover-lift group cursor-pointer">
                    <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-primary/20 relative">
                      {course.imageUrl ? (
                        <img
                          src={course.imageUrl}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <GraduationCap className="h-12 w-12 text-primary/40" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        {levelInfo && (
                          <Badge variant="secondary" className={levelInfo.color}>
                            {levelInfo.label}
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {course.shortDescription || course.description || "Curso de capacitación"}
                      </p>
                      <div className="flex items-center justify-between">
                        {course.duration && (
                          <span className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 mr-1" />
                            {course.duration}
                          </span>
                        )}
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
        </div>
      </section>

      {/* Learning Paths */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <Target className="h-12 w-12 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl font-bold mb-4">
              Rutas de Aprendizaje Personalizadas
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8">
              Diseñamos trayectorias formativas adaptadas a tu perfil: 
              prestador de servicios, capacitador o administrador.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              <Card className="bg-primary-foreground/10 border-primary-foreground/20">
                <CardContent className="p-4 text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-primary-foreground" />
                  <h3 className="font-medium text-primary-foreground">Prestadores</h3>
                  <p className="text-sm text-primary-foreground/70">Servicios turísticos</p>
                </CardContent>
              </Card>
              <Card className="bg-primary-foreground/10 border-primary-foreground/20">
                <CardContent className="p-4 text-center">
                  <Lightbulb className="h-8 w-8 mx-auto mb-2 text-primary-foreground" />
                  <h3 className="font-medium text-primary-foreground">Capacitadores</h3>
                  <p className="text-sm text-primary-foreground/70">Formación continua</p>
                </CardContent>
              </Card>
              <Card className="bg-primary-foreground/10 border-primary-foreground/20">
                <CardContent className="p-4 text-center">
                  <Award className="h-8 w-8 mx-auto mb-2 text-primary-foreground" />
                  <h3 className="font-medium text-primary-foreground">Administradores</h3>
                  <p className="text-sm text-primary-foreground/70">Gestión de proyectos</p>
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
