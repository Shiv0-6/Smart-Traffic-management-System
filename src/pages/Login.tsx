import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/db/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Activity, Shield, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const defaultUsername = import.meta.env.VITE_DEFAULT_ADMIN_USER || 'admin';
  const defaultPassword = import.meta.env.VITE_DEFAULT_ADMIN_PASS || 'admin123';
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Please enter username and password');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      toast.error('Username can only contain letters, numbers, and underscores');
      return;
    }

    // Default admin shortcut (full control)
    if (username === defaultUsername && password === defaultPassword) {
      const mockProfile = {
        id: 'mock-admin',
        username: defaultUsername,
        email: `${defaultUsername}@demo.local`,
        role: 'admin',
        created_at: new Date().toISOString(),
      };
      localStorage.setItem('mockAdminSession', 'true');
      localStorage.setItem('mockAdminProfile', JSON.stringify(mockProfile));
      toast.success('Logged in as default admin');
      const from = (location.state as any)?.from || '/';
      navigate(from);
      return;
    }

    setLoading(true);
    try {
      const email = `${username}@miaoda.com`;
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Login successful! Welcome back.');
      const from = (location.state as any)?.from || '/';
      navigate(from);
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Registration disabled in favor of default admin
  const handleSignup = async () => {
    toast.error('Registration is disabled. Use the default admin credentials below.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-md glass-card shadow-2xl border-primary/20">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-primary rounded-full shadow-lg">
              <Activity className="h-10 w-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold gradient-text">
            Smart Traffic Management
          </CardTitle>
          <CardDescription className="text-base">
            Sign in to access admin controls and manage the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">
                Letters, numbers, and underscores only
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="h-11 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-11 w-10"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Minimum 6 characters
              </p>
            </div>
            <div className="flex flex-col gap-3 pt-2">
              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-primary hover:opacity-90 transition-opacity" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 hover:bg-accent/10 transition-colors"
                onClick={handleSignup}
                disabled={loading}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Registration Disabled
              </Button>
            </div>
          </form>
          <div className="mt-6 space-y-3">
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-primary" />
                <span className="font-medium">Default Admin Credentials</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Username: <span className="font-semibold text-foreground">{defaultUsername}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Password: <span className="font-semibold text-foreground">{defaultPassword}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                This account has full editing and control permissions.
              </p>
            </div>
            <div className="text-center">
              <Button
                variant="link"
                className="text-sm"
                onClick={() => navigate('/')}
              >
                ← Back to Dashboard
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
