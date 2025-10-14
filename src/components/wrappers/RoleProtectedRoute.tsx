import { ReactNode } from "react";
import { Navigate } from "react-router";
import { useAuthContext } from "@/providers/auth-provider";

interface RoleProtectedRouteProps {
  children: ReactNode;
  roles: string[];
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

export default function RoleProtectedRoute({ children, roles }: RoleProtectedRouteProps) {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/auth/signin" replace />;
  }

  const role = (user.user_metadata?.role as string | undefined) ?? "user";

  if (!roles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
