import { useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import {
  GraduationCap,
  Clock,
  Users,
  Award,
  BookOpen,
  Play,
  ChevronLeft,
  CheckCircle,
  Target,
  FileText,
  Video,
  Star,
  Loader2,
} from "lucide-react";

const courseLevels = {
  basico: { label: "Básico", color: "bg-green-500/10 text-green-600" },
  intermedio: { label: "Intermedio", color: "bg-amber-500/10 text-amber-600" },
  avanzado: { label: "Avanzado", color: "bg-purple-500/10 text-purple-600" },
};

export default function CourseDetail() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const courseId = parseInt(params.id || "0");
  const { user, isAuthenticated } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showEnrollDialog, setShowEnrollDialog] = useState(false);

  const { data: course, isLoading } = trpc.courses.getById.useQuery({ id: courseId });
  
  const { data: enrollmentData, refetch: refetchEnrollment } = trpc.enrollments.checkEnrollment.useQuery(
    { courseId },
    { enabled: isAuthenticated }
  );

  const { data: enrollmentCount } = trpc.enrollments.getCourseEnrollmentCount.useQuery({ courseId });

  const enrollMutation = trpc.enrollments.enroll.useMutation({
    onSuccess: (data) => {
      if (data.alreadyEnrolled) {
        toast.info("Ya estás inscrito en este curso");
      } else {
        toast.success("¡Inscripción exitosa! Bienvenido al curso.");
      }
      refetchEnrollment();
      setShowEnrollDialog(false);
    },
    onError: (error) => {
      toast.error(error.message || "Error al inscribirse");
    },
  });

  const handleEnrollClick = () => {
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }
    setShowEnrollDialog(true);
  };

  const handleEnroll = () => {
    enrollMutation.mutate({ courseId });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <GraduationCap className="h-16 w-16 text-muted-foreground" />
          <h1 className="text-2xl font-bold">Curso no encontrado</h1>
          <Button asChild>
            <Link href="/campus-virtual">Volver al Campus Virtual</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const levelInfo = courseLevels[course.level as keyof typeof courseLevels];
  const isEnrolled = enrollmentData?.isEnrolled;
  const enrollment = enrollmentData?.enrollment;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title={course?.title || "Curso"}
        description={course?.shortDescription || course?.description?.slice(0, 160) || "Curso del Campus Virtual de Turismo Comunitario."}
        keywords={`${course?.title}, ${course?.category}, campus virtual, cursos turismo comunitario`}
        ogImage={course?.imageUrl || undefined}
      />
      <Navbar />

      {/* Breadcrumb */}
      <div className="border-b">
        <div className="container py-3">
          <Button variant="ghost" size="sm" asChild className="gap-1">
            <Link href="/campus-virtual">
              <ChevronLeft className="h-4 w-4" />
              Volver al Campus Virtual
            </Link>
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-500/10 via-background to-primary/5 py-8 md:py-12">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {levelInfo && (
                  <Badge variant="secondary" className={levelInfo.color}>
                    {levelInfo.label}
                  </Badge>
                )}
                {course.category && (
                  <Badge variant="outline">{course.category}</Badge>
                )}
                {course.isFeatured && (
                  <Badge className="bg-accent text-accent-foreground">
                    <Star className="h-3 w-3 mr-1" />
                    Destacado
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {course.title}
              </h1>

              <p className="text-lg text-muted-foreground mb-6">
                {course.shortDescription || course.description}
              </p>

              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                {course.duration && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>{course.duration}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>{enrollmentCount || 0} inscritos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span>Certificado incluido</span>
                </div>
              </div>
            </div>

            {/* Enrollment Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-primary/20 relative rounded-t-lg overflow-hidden">
                  {course.imageUrl ? (
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <GraduationCap className="h-16 w-16 text-primary/40" />
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  {isEnrolled && enrollment ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">Inscrito</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progreso</span>
                          <span className="font-medium">{enrollment.progress}%</span>
                        </div>
                        <Progress value={enrollment.progress} className="h-2" />
                      </div>

                      <Button className="w-full" size="lg" asChild>
                        <Link href="/mis-cursos">
                          <Play className="h-4 w-4 mr-2" />
                          Continuar Curso
                        </Link>
                      </Button>

                      <p className="text-xs text-center text-muted-foreground">
                        Estado: {enrollment.status === "completed" ? "Completado" : 
                                enrollment.status === "in_progress" ? "En progreso" : "Inscrito"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-primary mb-1">Gratis</p>
                        <p className="text-sm text-muted-foreground">Acceso completo</p>
                      </div>

                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={handleEnrollClick}
                        disabled={enrollMutation.isPending}
                      >
                        {enrollMutation.isPending ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <GraduationCap className="h-4 w-4 mr-2" />
                        )}
                        Inscribirme Ahora
                      </Button>

                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Acceso a todo el contenido
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Certificado de finalización
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Material descargable
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Acceso de por vida
                        </li>
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="section-padding">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Descripción del Curso
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {course.description || "Este curso te proporcionará los conocimientos y habilidades necesarios para desarrollarte en el ámbito del turismo comunitario sostenible."}
                  </p>
                </CardContent>
              </Card>

              {/* What you'll learn */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Lo que Aprenderás
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {[
                      "Fundamentos teóricos y prácticos",
                      "Metodologías de implementación",
                      "Casos de estudio reales",
                      "Herramientas de gestión",
                      "Buenas prácticas del sector",
                      "Estrategias de sostenibilidad",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Course Content */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Contenido del Curso
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { title: "Módulo 1: Introducción", lessons: 3, duration: "45 min" },
                    { title: "Módulo 2: Conceptos Fundamentales", lessons: 5, duration: "1.5 horas" },
                    { title: "Módulo 3: Aplicación Práctica", lessons: 4, duration: "2 horas" },
                    { title: "Módulo 4: Casos de Estudio", lessons: 3, duration: "1 hora" },
                    { title: "Módulo 5: Evaluación Final", lessons: 2, duration: "30 min" },
                  ].map((module, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{module.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {module.lessons} lecciones • {module.duration}
                          </p>
                        </div>
                      </div>
                      <Video className="h-5 w-5 text-muted-foreground" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Course includes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Este curso incluye</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Video className="h-5 w-5 text-primary" />
                    <span>{course.duration || "8 horas"} de video</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <FileText className="h-5 w-5 text-primary" />
                    <span>Material descargable</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Award className="h-5 w-5 text-primary" />
                    <span>Certificado de finalización</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>Acceso de por vida</span>
                  </div>
                </CardContent>
              </Card>

              {/* Related courses */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cursos Relacionados</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Explora más cursos en el{" "}
                    <Link href="/campus-virtual" className="text-primary hover:underline">
                      Campus Virtual
                    </Link>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inicia sesión para inscribirte</DialogTitle>
            <DialogDescription>
              Necesitas una cuenta para inscribirte en los cursos y hacer seguimiento de tu progreso.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowLoginDialog(false)}>
              Cancelar
            </Button>
            <Button asChild>
              <a href={getLoginUrl()}>Iniciar Sesión</a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Enroll Confirmation Dialog */}
      <Dialog open={showEnrollDialog} onOpenChange={setShowEnrollDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Inscripción</DialogTitle>
            <DialogDescription>
              ¿Deseas inscribirte en el curso "{course.title}"?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Acceso inmediato a todo el contenido
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Podrás ver tu progreso en "Mis Cursos"
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Recibirás un certificado al completar
              </li>
            </ul>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowEnrollDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEnroll} disabled={enrollMutation.isPending}>
              {enrollMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Confirmar Inscripción
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
