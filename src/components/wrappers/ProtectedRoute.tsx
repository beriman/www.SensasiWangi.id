import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "@/providers/auth-provider";

interface ProtectedRouteProps {
  allowedRoles: string[];
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth/signin" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
