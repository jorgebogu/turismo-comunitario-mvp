import { useState } from "react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import {
  GraduationCap,
  Clock,
  Award,
  BookOpen,
  Play,
  CheckCircle,
  Loader2,
  Trophy,
  Target,
  TrendingUp,
  X,
  ExternalLink,
} from "lucide-react";
import CertificateViewer from "@/components/CertificateViewer";

const courseLevels = {
  basico: { label: "Básico", color: "bg-green-500/10 text-green-600" },
  intermedio: { label: "Intermedio", color: "bg-amber-500/10 text-amber-600" },
  avanzado: { label: "Avanzado", color: "bg-purple-500/10 text-purple-600" },
};

const statusLabels = {
  enrolled: { label: "Inscrito", color: "bg-blue-500/10 text-blue-600" },
  in_progress: { label: "En Progreso", color: "bg-amber-500/10 text-amber-600" },
  completed: { label: "Completado", color: "bg-green-500/10 text-green-600" },
  dropped: { label: "Abandonado", color: "bg-red-500/10 text-red-600" },
};

export default function MyCourses() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [selectedEnrollment, setSelectedEnrollment] = useState<number | null>(null);
  const [showDropDialog, setShowDropDialog] = useState(false);
  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const [newProgress, setNewProgress] = useState(0);

  const { data: enrollments, isLoading, refetch } = trpc.enrollments.myEnrollments.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const { data: stats } = trpc.enrollments.myStats.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const dropMutation = trpc.enrollments.drop.useMutation({
    onSuccess: () => {
      toast.success("Has abandonado el curso");
      refetch();
      setShowDropDialog(false);
      setSelectedEnrollment(null);
    },
    onError: (error) => {
      toast.error(error.message || "Error al abandonar el curso");
    },
  });

  const updateProgressMutation = trpc.enrollments.updateProgress.useMutation({
    onSuccess: () => {
      toast.success("Progreso actualizado");
      refetch();
      setShowProgressDialog(false);
      setSelectedEnrollment(null);
    },
    onError: (error) => {
      toast.error(error.message || "Error al actualizar progreso");
    },
  });

  const handleDrop = () => {
    if (selectedEnrollment) {
      dropMutation.mutate({ enrollmentId: selectedEnrollment });
    }
  };

  const handleUpdateProgress = () => {
    if (selectedEnrollment) {
      updateProgressMutation.mutate({ enrollmentId: selectedEnrollment, progress: newProgress });
    }
  };

  // Not authenticated
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
          <div className="text-center">
            <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Inicia sesión para ver tus cursos</h1>
            <p className="text-muted-foreground mb-6">
              Accede a tu cuenta para ver tus inscripciones y progreso en los cursos.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <a href={getLoginUrl()}>Iniciar Sesión</a>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/campus-virtual">Explorar Cursos</Link>
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Loading
  if (authLoading || isLoading) {
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

  const activeEnrollments = enrollments?.filter(e => e.enrollment.status !== "dropped") || [];
  const completedEnrollments = enrollments?.filter(e => e.enrollment.status === "completed") || [];
  const inProgressEnrollments = enrollments?.filter(e => 
    e.enrollment.status === "in_progress" || e.enrollment.status === "enrolled"
  ) || [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-500/10 via-background to-primary/5 py-8 md:py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Mis Cursos
              </h1>
              <p className="text-muted-foreground">
                Bienvenido, {user?.name || "Usuario"}. Aquí puedes ver tu progreso.
              </p>
            </div>
            <Button asChild>
              <Link href="/campus-virtual">
                <BookOpen className="h-4 w-4 mr-2" />
                Explorar más cursos
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="inline-flex p-3 rounded-full bg-blue-500/10 text-blue-600 mb-2">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold">{stats?.total || 0}</div>
                <div className="text-sm text-muted-foreground">Total Cursos</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="inline-flex p-3 rounded-full bg-amber-500/10 text-amber-600 mb-2">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold">{stats?.inProgress || 0}</div>
                <div className="text-sm text-muted-foreground">En Progreso</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="inline-flex p-3 rounded-full bg-green-500/10 text-green-600 mb-2">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold">{stats?.completed || 0}</div>
                <div className="text-sm text-muted-foreground">Completados</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="inline-flex p-3 rounded-full bg-purple-500/10 text-purple-600 mb-2">
                  <Trophy className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold">{stats?.completed || 0}</div>
                <div className="text-sm text-muted-foreground">Certificados</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="section-padding">
        <div className="container">
          {activeEnrollments.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">No tienes cursos inscritos</h2>
                <p className="text-muted-foreground mb-6">
                  Explora nuestro catálogo y comienza tu aprendizaje hoy.
                </p>
                <Button asChild>
                  <Link href="/campus-virtual">Explorar Cursos</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList>
                <TabsTrigger value="all">
                  Todos ({activeEnrollments.length})
                </TabsTrigger>
                <TabsTrigger value="in_progress">
                  En Progreso ({inProgressEnrollments.length})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completados ({completedEnrollments.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {activeEnrollments.map(({ enrollment, course }) => (
                  <CourseCard
                    key={enrollment.id}
                    enrollment={enrollment}
                    course={course}
                    onUpdateProgress={() => {
                      setSelectedEnrollment(enrollment.id);
                      setNewProgress(enrollment.progress || 0);
                      setShowProgressDialog(true);
                    }}
                    onDrop={() => {
                      setSelectedEnrollment(enrollment.id);
                      setShowDropDialog(true);
                    }}
                  />
                ))}
              </TabsContent>

              <TabsContent value="in_progress" className="space-y-4">
                {inProgressEnrollments.length === 0 ? (
                  <Card className="text-center py-8">
                    <CardContent>
                      <p className="text-muted-foreground">No tienes cursos en progreso</p>
                    </CardContent>
                  </Card>
                ) : (
                  inProgressEnrollments.map(({ enrollment, course }) => (
                    <CourseCard
                      key={enrollment.id}
                      enrollment={enrollment}
                      course={course}
                      onUpdateProgress={() => {
                        setSelectedEnrollment(enrollment.id);
                        setNewProgress(enrollment.progress || 0);
                        setShowProgressDialog(true);
                      }}
                      onDrop={() => {
                        setSelectedEnrollment(enrollment.id);
                        setShowDropDialog(true);
                      }}
                    />
                  ))
                )}
              </TabsContent>

              <TabsContent value="completed" className="space-y-4">
                {completedEnrollments.length === 0 ? (
                  <Card className="text-center py-8">
                    <CardContent>
                      <p className="text-muted-foreground">Aún no has completado ningún curso</p>
                    </CardContent>
                  </Card>
                ) : (
                  completedEnrollments.map(({ enrollment, course }) => (
                    <CourseCard
                      key={enrollment.id}
                      enrollment={enrollment}
                      course={course}
                      onUpdateProgress={() => {
                        setSelectedEnrollment(enrollment.id);
                        setNewProgress(enrollment.progress || 0);
                        setShowProgressDialog(true);
                      }}
                      onDrop={() => {
                        setSelectedEnrollment(enrollment.id);
                        setShowDropDialog(true);
                      }}
                    />
                  ))
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>

      {/* Drop Course Dialog */}
      <AlertDialog open={showDropDialog} onOpenChange={setShowDropDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Abandonar este curso?</AlertDialogTitle>
            <AlertDialogDescription>
              Tu progreso se guardará, pero el curso se moverá a la sección de abandonados.
              Podrás volver a inscribirte en cualquier momento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDrop}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {dropMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Abandonar Curso
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Update Progress Dialog */}
      <Dialog open={showProgressDialog} onOpenChange={setShowProgressDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Actualizar Progreso</DialogTitle>
            <DialogDescription>
              Indica tu progreso actual en el curso (0-100%)
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progreso</span>
                <span className="font-medium">{newProgress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={newProgress}
                onChange={(e) => setNewProgress(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            {newProgress >= 100 && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 text-green-600">
                <Trophy className="h-5 w-5" />
                <span className="text-sm font-medium">¡Felicidades! Completarás el curso.</span>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProgressDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateProgress} disabled={updateProgressMutation.isPending}>
              {updateProgressMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Guardar Progreso
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

// Course Card Component
function CourseCard({
  enrollment,
  course,
  onUpdateProgress,
  onDrop,
}: {
  enrollment: any;
  course: any;
  onUpdateProgress: () => void;
  onDrop: () => void;
}) {
  const levelInfo = courseLevels[course.level as keyof typeof courseLevels];
  const statusInfo = statusLabels[enrollment.status as keyof typeof statusLabels];

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Course Image */}
        <div className="md:w-48 aspect-video md:aspect-auto bg-gradient-to-br from-blue-500/20 to-primary/20 relative shrink-0">
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
          {enrollment.status === "completed" && (
            <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
              <div className="bg-green-500 text-white rounded-full p-2">
                <CheckCircle className="h-8 w-8" />
              </div>
            </div>
          )}
        </div>

        {/* Course Info */}
        <div className="flex-1 p-4 md:p-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {levelInfo && (
              <Badge variant="secondary" className={levelInfo.color}>
                {levelInfo.label}
              </Badge>
            )}
            {statusInfo && (
              <Badge variant="secondary" className={statusInfo.color}>
                {statusInfo.label}
              </Badge>
            )}
          </div>

          <h3 className="text-lg font-semibold mb-2">
            <Link href={`/curso/${course.id}`} className="hover:text-primary transition-colors">
              {course.title}
            </Link>
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {course.shortDescription || course.description}
          </p>

          {/* Progress Bar */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progreso</span>
              <span className="font-medium">{enrollment.progress || 0}%</span>
            </div>
            <Progress value={enrollment.progress || 0} className="h-2" />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            {enrollment.status === "completed" ? (
              <>
                <CertificateViewer
                  enrollmentId={enrollment.id}
                  courseTitle={course.title}
                  isCompleted={true}
                />
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/curso/${course.id}`}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ver Curso
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" asChild>
                  <Link href={`/curso/${course.id}`}>
                    <Play className="h-4 w-4 mr-2" />
                    Continuar
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={onUpdateProgress}>
                  <Target className="h-4 w-4 mr-2" />
                  Actualizar Progreso
                </Button>
                <Button variant="ghost" size="sm" onClick={onDrop}>
                  <X className="h-4 w-4 mr-2" />
                  Abandonar
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
