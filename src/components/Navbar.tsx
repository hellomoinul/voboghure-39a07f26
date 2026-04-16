import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useBrand } from '@/contexts/BrandContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CommunitySwitcher } from '@/components/CommunitySwitcher';
import NotificationBell from '@/components/NotificationBell';
import { 
  LogOut, User, ChevronDown, Menu, X, ArrowLeft, ShieldCheck 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

interface NavbarProps {
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
}

const publicLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
];

const backButtonRoutes = [
  '/about', '/request-access', '/forgot-password', '/update-password',
  '/create-community', '/community-home',
];

function shouldShowBack(pathname: string): boolean {
  if (backButtonRoutes.includes(pathname)) return true;
  if (/^\/(communities|events|stories|members|profile)\/[^/]+$/.test(pathname)) return true;
  return false;
}

export function Navbar({ onToggleSidebar, sidebarOpen }: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const { brand } = useBrand();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isPublicRoute = ['/', '/login', '/request-access', '/about'].includes(location.pathname);
  const showBack = shouldShowBack(location.pathname);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      {/* Outside Click Overlay: Non-blur background */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 md:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className="flex h-16 items-center px-4 md:px-6 relative z-50">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            title="Go back"
            className="mr-2 p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}

        {/* Single Menu Toggle Logic */}
        {!showBack && (
          <button
            onClick={() => {
              if (isAuthenticated && !isPublicRoute) {
                onToggleSidebar?.();
              } else {
                setMobileMenuOpen(prev => !prev);
              }
            }}
            aria-label="Toggle menu"
            title="Menu"
            className="mr-3 p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        )}

        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2 mr-6">
          <span className="text-2xl leading-none">{brand.logo}</span>
          <span className="font-serif text-xl font-bold tracking-tight hidden sm:block">
            {brand.communityName}
          </span>
        </Link>

        {isAuthenticated && !isPublicRoute && (
          <div className="hidden md:block">
            <CommunitySwitcher />
          </div>
        )}

        <nav className="hidden md:flex items-center gap-1 flex-1">
          {!isAuthenticated && publicLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.to ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {isAuthenticated ? (
            <>
              <NotificationBell />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    aria-label="User menu"
                    title="User menu"
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-secondary outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <img 
                      src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} 
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-border" 
                      alt="avatar"
                    />
                    <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
                  </button>
                </DropdownMenuTrigger>
                {/* Profile Dropdown: Solid Background, No Transparency */}
                <DropdownMenuContent align="end" className="w-56 bg-card border-border shadow-md opacity-100 z-60">
                  <div className="px-3 py-2 border-b border-border/50">
                    <p className="text-sm font-semibold">{user?.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                  </div>
                  <DropdownMenuItem onClick={() => navigate(`/members/${user?.id}`)} className="cursor-pointer mt-1">
                    <User className="mr-2 h-4 w-4" /> My Profile
                  </DropdownMenuItem>
                  
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer text-primary font-medium">
                      <ShieldCheck className="mr-2 h-4 w-4" /> Admin Panel
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => { logout(); navigate('/'); }} className="cursor-pointer text-destructive focus:bg-destructive/10">
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button variant="default" size="sm" onClick={() => navigate('/login')} className="hidden md:flex">
              Login
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown: Solid Background, No Blur */}
      {!isAuthenticated && mobileMenuOpen && (
        <nav className="md:hidden border-t border-border bg-background px-4 py-3 space-y-1 shadow-lg animate-in slide-in-from-top-1">
          {publicLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="block px-4 py-3 rounded-lg text-base font-medium hover:bg-secondary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}