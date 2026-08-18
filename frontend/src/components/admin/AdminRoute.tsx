import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";

export function AdminRoute() {
  const { user, status } = useAuth();
  const navigate = useNavigate();

  if (status === "loading") {
    return (
      <div className="container-frontera py-10">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="mt-3 h-9 w-56" />
      </div>
    );
  }

  if (status === "unauthenticated" || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "ADMIN") {
    return (
      <div className="container-frontera py-20">
        <EmptyState
          title="Solo administradores"
          description="Tu cuenta no tiene permisos para administrar La Frontera."
          action={
            <Button variant="outline" onClick={() => navigate("/")}>
              Volver al inicio
            </Button>
          }
        />
      </div>
    );
  }

  return <Outlet />;
}
