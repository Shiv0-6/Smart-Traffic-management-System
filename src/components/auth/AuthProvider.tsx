import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/db/supabase';
import type { Profile } from '@/types/types';
import { profilesApi } from '@/db/api';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const restoreMockSession = () => {
    const storedProfile = localStorage.getItem('mockAdminProfile');
    if (!storedProfile) return false;
    try {
      const parsedProfile = JSON.parse(storedProfile) as Profile;
      const mockUser = {
        id: parsedProfile.id,
        email: parsedProfile.email,
      } as User;
      setUser(mockUser);
      setProfile(parsedProfile);
      return true;
    } catch (error) {
      console.error('Failed to parse mock admin profile', error);
      localStorage.removeItem('mockAdminProfile');
      localStorage.removeItem('mockAdminSession');
      return false;
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      const profileData = await profilesApi.getById(userId);
      setProfile(profileData);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    const restored = restoreMockSession();

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!restored) {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        }
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        const wasRestored = restoreMockSession();
        if (!wasRestored) {
          setUser(null);
          setProfile(null);
        }
      } else {
        setUser(session.user);
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Ensure mock admin session is applied if localStorage was set during the current session
  useEffect(() => {
    if (!user && !profile) {
      restoreMockSession();
    }
  }, [user, profile]);

  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('mockAdminSession');
    localStorage.removeItem('mockAdminProfile');
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
