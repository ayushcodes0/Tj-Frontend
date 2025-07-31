import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { hasActivePro } from '../utils/subscriptionUtils';

export function RequirePro({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (!hasActivePro(user)) return <Navigate to="/pricing" />;
  return children;
}
