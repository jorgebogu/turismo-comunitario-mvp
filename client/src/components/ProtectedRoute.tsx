import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { PageSkeleton } from "@/components/SkeletonLoaders";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "user";
}

/**
 * Componente wrapper que protege rutas requiriendo autenticación.
 * Redirige al login si el usuario no está autenticado.
 * Opcionalmente verifica el rol del usuario.
 */
export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageSkeleton />;
  }

  if (!user) {
    // Redirigir al login
    window.location.href = getLoginUrl();
    return <PageSkeleton />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="container py-16 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="text-6xl">🔒</div>
          <h1 className="text-2xl font-bold text-foreground">Acceso Restringido</h1>
          <p className="text-muted-foreground">
            No tienes permisos para acceder a esta sección. 
            Se requiere rol de <strong>{requiredRole === "admin" ? "administrador" : "usuario"}</strong>.
          </p>
          <a
            href="/"
            className="inline-block mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Volver al Inicio
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
