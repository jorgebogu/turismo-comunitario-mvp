import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Geoportal from "./pages/Geoportal";
import ContentCenter from "./pages/ContentCenter";
import Campus from "./pages/Campus";
import Badges from "./pages/Badges";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import About from "./pages/About";
import ExperienceDetail from "./pages/ExperienceDetail";
import CourseDetail from "./pages/CourseDetail";
import MyCourses from "./pages/MyCourses";
import VerifyCertificate from "./pages/VerifyCertificate";
import MyReservations from "./pages/MyReservations";

function Router() {
  return (
    <Switch>
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
      <Route path="/mis-cursos" component={MyCourses} />
      <Route path="/verificar-certificado" component={VerifyCertificate} />
      <Route path="/mis-reservaciones" component={MyReservations} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
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
