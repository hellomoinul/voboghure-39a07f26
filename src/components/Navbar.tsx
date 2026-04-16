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

  // মেনু ক্লোজ করার লজিক
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      {/* Outside Click Fix: মেনুর বাইরে ক্লিক করলে বন্ধ হবে */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/5 backdrop-blur-[2px] md:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className="flex h-16 items-center px-4 md:px-6 relative z-50">
        {/* Back Button */}
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

        {/* SINGLE MENU BUTTON: ডাবল হ্যামবার্গার সমস্যার সমাধান */}
        {!showBack && (
          <button
            onClick={() => {
              if (isAuthenticated && !isPublicRoute) {
                onToggleSidebar?.(); // লগইন থাকলে মেইন সাইডবার টগল হবে
              } else {
                setMobileMenuOpen(prev => !prev); // না থাকলে মোবাইল ড্রপডাউন মেনু খুলবে
              }
            }}
            aria-label="Toggle menu"
            title="Menu"
            className="mr-3 p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        )}

        {/* Logo */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2 mr-6">
          <span className="text-2xl leading-none">{brand.logo}</span>
          <span className="font-serif text-xl font-bold tracking-tight hidden sm:block">
            {brand.communityName}
          </span>
        </Link>

        {/* Desktop View Switcher & Nav */}
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
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-secondary outline-none"
                  >
                    <img 
                      src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} 
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20" 
                      alt="avatar"
                    />
                    <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-card shadow-xl">
                  <div className="px-3 py-2 text-foreground">
                    <p className="text-sm font-semibold">{user?.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(`/members/${user?.id}`)} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" /> My Profile
                  </DropdownMenuItem>
                  
                  {/* Admin Panel শুধুমাত্র এখানে থাকবে */}
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer text-primary font-medium">
                      <ShieldCheck className="mr-2 h-4 w-4" /> Admin Panel
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => { logout(); navigate('/'); }} className="cursor-pointer text-destructive">
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

      {/* Mobile Menu Dropdown */}
      {!isAuthenticated && mobileMenuOpen && (
        <nav className="md:hidden border-t border-border/50 bg-background px-4 py-4 space-y-2">
          {publicLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="block px-4 py-3 rounded-xl text-base font-medium hover:bg-secondary"
            >
              {link.label}
            </Link>
          ))}
          <Button className="w-full mt-4" onClick={() => navigate('/login')}>
            Login
          </Button>
        </nav>
      )}
    </header>
  );
}