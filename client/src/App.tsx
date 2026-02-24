import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { lazy, Suspense } from "react";
import { PageSkeleton } from "@/components/SkeletonLoaders";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Lazy-loaded pages para reducir el bundle inicial
const Home = lazy(() => import("./pages/Home"));
const Geoportal = lazy(() => import("./pages/Geoportal"));
const ContentCenter = lazy(() => import("./pages/ContentCenter"));
const Campus = lazy(() => import("./pages/Campus"));
const Badges = lazy(() => import("./pages/Badges"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Contact = lazy(() => import("./pages/Contact"));
const About = lazy(() => import("./pages/About"));
const ExperienceDetail = lazy(() => import("./pages/ExperienceDetail"));
const CourseDetail = lazy(() => import("./pages/CourseDetail"));
const MyCourses = lazy(() => import("./pages/MyCourses"));
const VerifyCertificate = lazy(() => import("./pages/VerifyCertificate"));
const MyReservations = lazy(() => import("./pages/MyReservations"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminAvailability = lazy(() => import("./pages/AdminAvailability"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfUse = lazy(() => import("./pages/TermsOfUse"));
const NotFound = lazy(() => import("./pages/NotFound"));

function Router() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Switch>
        {/* Rutas públicas */}
        <Route path="/" component={Home} />
        <Route path="/geoportal" component={Geoportal} />
        <Route path="/centro-contenido" component={ContentCenter} />
        <Route path="/campus-virtual" component={Campus} />
        <Route path="/distintivos" component={Badges} />
        <Route path="/galeria" component={Gallery} />
        <Route path="/contacto" component={Contact} />
        <Route path="/acerca" component={About} />
        <Route path="/experiencia/:id" component={ExperienceDetail} />
        <Route path="/curso/:id" component={CourseDetail} />
        <Route path="/verificar-certificado" component={VerifyCertificate} />
        <Route path="/aviso-privacidad" component={PrivacyPolicy} />
        <Route path="/terminos-uso" component={TermsOfUse} />

        {/* Rutas protegidas - requieren autenticación */}
        <Route path="/mis-cursos">
          <ProtectedRoute>
            <MyCourses />
          </ProtectedRoute>
        </Route>
        <Route path="/mis-reservaciones">
          <ProtectedRoute>
            <MyReservations />
          </ProtectedRoute>
        </Route>

        {/* Rutas de administración - requieren rol admin */}
        <Route path="/admin">
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/disponibilidad">
          <ProtectedRoute requiredRole="admin">
            <AdminAvailability />
          </ProtectedRoute>
        </Route>

        {/* 404 */}
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
