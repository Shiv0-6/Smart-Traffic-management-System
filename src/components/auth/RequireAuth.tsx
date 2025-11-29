import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

interface RequireAuthProps {
  children: React.ReactNode;
  whiteList?: string[];
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children, whiteList = [] }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      const isWhitelisted = whiteList.some(path => {
        if (path.endsWith('/*')) {
          return location.pathname.startsWith(path.slice(0, -2));
        }
        return location.pathname === path;
      });

      if (!isWhitelisted) {
        navigate('/login', { state: { from: location.pathname } });
      }
    }
  }, [user, loading, navigate, location, whiteList]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
};
