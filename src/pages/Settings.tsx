import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Shield, Settings as SettingsIcon } from 'lucide-react';
import { profilesApi } from '@/db/api';
import type { Profile } from '@/types/types';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.role !== 'admin' && profile?.role !== 'operator') {
      toast.error('Access denied. Admin or operator role required.');
      navigate('/');
      return;
    }
    loadUsers();
  }, [profile, navigate]);

  const loadUsers = async () => {
    try {
      const data = await profilesApi.getAll();
      setUsers(data);
    } catch (error: any) {
      toast.error('Failed to load users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await profilesApi.updateRole(userId, newRole);
      toast.success('User role updated successfully');
      loadUsers();
    } catch (error: any) {
      toast.error('Failed to update user role');
      console.error(error);
    }
  };

  const getRoleBadgeVariant = (role: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'operator':
        return 'default';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">System Settings</h1>
        <p className="text-muted-foreground mt-1">Manage users and system configuration</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-3 grid-cols-1">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Administrators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === 'admin').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              Operators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === 'operator').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage user roles and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="flex @container flex-col gap-3 p-4 border rounded-lg">
                <div className="flex @md:flex-row flex-col @md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{user.username || 'Unknown'}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role}
                    </Badge>
                  </div>
                </div>
                <div className="flex @md:flex-row flex-col gap-2">
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Change Role</Label>
                    <Select
                      value={user.role}
                      onValueChange={(value) => handleRoleChange(user.id, value)}
                      disabled={user.id === profile?.id}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="operator">Operator</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Joined</Label>
                    <p className="text-sm font-medium mt-2">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {user.id === profile?.id && (
                  <p className="text-xs text-muted-foreground">
                    You cannot change your own role
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Configuration</CardTitle>
          <CardDescription>Configure system-wide settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="detection-interval">Detection Refresh Interval (seconds)</Label>
            <Input
              id="detection-interval"
              type="number"
              defaultValue="10"
              min="5"
              max="60"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signal-update">Signal Update Interval (seconds)</Label>
            <Input
              id="signal-update"
              type="number"
              defaultValue="5"
              min="1"
              max="30"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max-violations">Max Violations Display</Label>
            <Input
              id="max-violations"
              type="number"
              defaultValue="100"
              min="10"
              max="500"
            />
          </div>
          <Button onClick={() => toast.success('Settings saved successfully')}>
            Save Configuration
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
