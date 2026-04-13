import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { PageLoader } from '../common/PageLoader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
  modules?: string[];
  permissions?: string[];
}

export function ProtectedRoute({ children, roles, modules, permissions }: ProtectedRouteProps) {
  const location = useLocation();
  const { loading, isAuthenticated, user, canAccessModule, canAccessPermission } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace state={{ from: location.pathname }} />;
  }

  if (roles?.length && user && !roles.includes(user.role)) {
    return <Navigate to='/' replace />;
  }

  if (modules?.length && !canAccessModule(...modules)) {
    return <Navigate to='/' replace />;
  }

  if (permissions?.length && !canAccessPermission(...permissions)) {
    return <Navigate to='/' replace />;
  }

  return <>{children}</>;
}
