import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

interface ProtectedRouteProps {
  allowedRoles: string[];
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const currentUser = useQuery(api.users.getCurrentUser);

  if (currentUser === undefined) {
    // Still loading user data
    return <div>Loading...</div>; 
  }

  if (currentUser && allowedRoles.includes(currentUser.role)) {
    return children ? <>{children}</> : <Outlet />;
  } else if (currentUser && !allowedRoles.includes(currentUser.role)) {
    // User is logged in but not authorized
    return <Navigate to="/" replace />;
  } else {
    // User is not logged in
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;