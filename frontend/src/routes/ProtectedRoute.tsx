import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/store';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** If provided, user must have this role. Otherwise any authenticated user can access. */
  requiredRole?: UserRole;
}

/**
 * Restricts access to authenticated users only.
 * Optionally, also restricts to a required role (e.g. ADMIN).
 * Saves the attempted URL in `state.from` so LoginPage can redirect back after login.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Authenticated but wrong role — redirect to home
    return <Navigate to="/products" replace />;
  }

  return <>{children}</>;
};
