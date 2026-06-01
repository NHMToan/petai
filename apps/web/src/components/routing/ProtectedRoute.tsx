import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/auth-context";
import type { Role } from "../../types";

export function ProtectedRoute({ role }: { role?: Role }) {
  const { isAuthenticated, hasRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  if (role && !hasRole(role)) {
    return <Navigate replace to="/app/dashboard" />;
  }

  return <Outlet />;
}
