import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
export function RequireGuest({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" />;
  return children;
}
