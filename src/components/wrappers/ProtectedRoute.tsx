import { useUser } from "@clerk/clerk-react";
import { useQuery, useMutation } from "convex/react";
import { ReactNode, useEffect } from "react";
import { Navigate } from "react-router";
import { api } from "../../../convex/_generated/api";

interface ProtectedRouteProps {
  children: ReactNode;
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center neumorphic-bg">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#667eea]"></div>
        <p className="text-[#86868B]">Memuat...</p>
      </div>
    </div>
  );
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoaded: isUserLoaded, isSignedIn } = useUser();
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);

  // Only query if user is loaded and exists
  const userData = useQuery(
    api.users.getUserByToken,
    isUserLoaded && user?.id ? { tokenIdentifier: user.id } : "skip",
  );

  // Ensure user exists in database when they access protected routes
  useEffect(() => {
    if (isUserLoaded && isSignedIn && user && userData === null) {
      // User is authenticated but doesn't exist in database, create them
      createOrUpdateUser().catch((error) => {
        console.error("Error creating user in protected route:", error);
      });
    }
  }, [isUserLoaded, isSignedIn, user, userData, createOrUpdateUser]);

  // Step 1: Wait for Clerk to initialize
  if (!isUserLoaded) {
    return <LoadingSpinner />;
  }

  // Step 2: Check if user is authenticated
  if (!isSignedIn || !user) {
    return <Navigate to="/login" replace />;
  }

  // Step 3: Wait for user data to load
  if (userData === undefined) {
    return <LoadingSpinner />;
  }

  // Step 4: If user doesn't exist in database, show loading while creating
  if (userData === null) {
    return <LoadingSpinner />;
  }

  // All checks passed, render protected content
  return <>{children}</>;
}
