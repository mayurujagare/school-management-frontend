import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RoleGuard({ roles, children }) {
  const { hasRole } = useAuth();

  if (!hasRole(roles)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}