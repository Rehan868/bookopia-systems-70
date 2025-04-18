
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  ownerOnly?: boolean;
  roles?: Array<'admin' | 'manager' | 'staff' | 'cleaner' | 'owner' | 'guest'>;
}

export function ProtectedRoute({ 
  children, 
  ownerOnly = false,
  roles = []
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Not authenticated
  if (!isAuthenticated) {
    return <Navigate to={ownerOnly ? "/owner/login" : "/login"} state={{ from: location }} replace />;
  }
  
  // Check for owner route
  if (ownerOnly && user?.role !== 'owner') {
    return <Navigate to="/login" replace />;
  }
  
  // Role-based check
  if (roles.length > 0 && user?.role && !roles.includes(user.role)) {
    // Redirect users without required role
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
