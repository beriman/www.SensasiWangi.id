import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { ReactNode } from "react";
import { Navigate } from "react-router";
import { api } from "../../../convex/_generated/api";

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
  const { user, isLoaded: isUserLoaded } = useUser();
  const userData = useQuery(
    api.users.getUserByToken,
    isUserLoaded && user?.id ? { tokenIdentifier: user.id } : "skip"
  );

  if (!isUserLoaded) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (userData === undefined) {
    return <LoadingSpinner />;
  }

  if (userData === null) {
    return <Navigate to="/" replace />;
  }

  if (!roles.includes(userData.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
