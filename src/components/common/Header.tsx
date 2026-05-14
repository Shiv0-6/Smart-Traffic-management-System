import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Car,
  Gauge,
  LogIn,
  LogOut,
  Menu,
  Route,
  Settings,
  Shield,
  SlidersHorizontal,
} from "lucide-react";
import routes from "../../routes";
import { useAuth } from "@/components/auth/AuthProvider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const navigation = routes.filter((route) => route.visible !== false);

  const filteredNavigation = navigation.filter(route => {
    if (route.path === '/settings' && profile?.role !== 'admin' && profile?.role !== 'operator') {
      return false;
    }
    return true;
  });

  const isAdmin = profile?.role === 'admin' || profile?.role === 'operator';
  const navIcons = {
    '/': Gauge,
    '/detection': Car,
    '/simulation': Route,
    '/advanced': BarChart3,
    '/signals': SlidersHorizontal,
    '/violations': AlertTriangle,
    '/analysis': BarChart3,
    '/settings': Settings,
  };

  const NavLinks = () => (
    <>
      {filteredNavigation.map((item) => {
        const Icon = navIcons[item.path as keyof typeof navIcons] || Activity;
        const isActive = location.pathname === item.path;

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
            }`}
          >
            <Icon className={`h-4 w-4 ${isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"}`} />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/88 shadow-sm backdrop-blur-xl">
      <nav className="container mx-auto max-w-[1500px] px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="rounded-lg bg-primary p-2 shadow-sm">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div className="leading-tight">
                <span className="block text-base font-semibold tracking-tight">
                  Smart Traffic
                </span>
                <span className="hidden text-xs text-muted-foreground sm:block">
                  Control Center
                </span>
              </div>
            </Link>

            <div className="hidden xl:flex items-center gap-2">
              <NavLinks />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {user && profile ? (
              <div className="hidden xl:flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                      {profile.username?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{profile.username}</span>
                    {isAdmin ? (
                      <Badge className="text-xs w-fit bg-accent text-accent-foreground border-0">
                        <Shield className="h-3 w-3 mr-1" />
                        Admin
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs w-fit">
                        Viewer
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={signOut}
                  title="Sign out"
                  className="hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => navigate('/login')}
                className="hidden xl:flex"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Admin Login
              </Button>
            )}

            <Sheet>
              <SheetTrigger asChild className="xl:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-4 mt-8">
                  {user && profile ? (
                    <div className="flex items-center gap-3 pb-4 border-b">
                      <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                        <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                          {profile.username?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{profile.username}</span>
                        {isAdmin ? (
                          <Badge className="text-xs w-fit bg-accent text-accent-foreground border-0">
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs w-fit">
                            Viewer
                          </Badge>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={() => navigate('/login')}
                      className="w-full"
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Admin Login
                    </Button>
                  )}
                  <div className="flex flex-col gap-2">
                    <NavLinks />
                  </div>
                  {user && (
                    <Button
                      variant="outline"
                      className="w-full justify-start hover:bg-destructive/10 hover:text-destructive"
                      onClick={signOut}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
