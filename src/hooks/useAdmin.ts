import { useAuth } from '@/components/auth/AuthProvider';

export const useAdmin = () => {
  const { profile } = useAuth();
  
  const isAdmin = profile?.role === 'admin' || profile?.role === 'operator';
  const isAuthenticated = !!profile;
  
  return {
    isAdmin,
    isAuthenticated,
    role: profile?.role,
  };
};
