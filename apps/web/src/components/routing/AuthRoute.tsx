import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../features/auth/auth-context";

export function AuthRoute() {
  const { session } = useAuth();

  if (session) {
    return <Navigate replace to={session.user.role === "ADMIN" ? "/admin/dashboard" : "/app/dashboard"} />;
  }

  return <Outlet />;
}
