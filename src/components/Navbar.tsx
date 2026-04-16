import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useBrand } from '@/contexts/BrandContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CommunitySwitcher } from '@/components/CommunitySwitcher';
import NotificationBell from '@/components/NotificationBell';
import { 
  LogOut, User, ChevronDown, Menu, X 
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

export function Navbar({ onToggleSidebar, sidebarOpen }: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const { brand } = useBrand();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isPublicRoute = ['/', '/login', '/request-access', '/about'].includes(location.pathname);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 items-center px-4 md:px-6">
        {/* Sidebar toggle for private routes */}
        {isAuthenticated && !isPublicRoute && (
          <button
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
            className="mr-3 p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {/* Mobile menu toggle for public routes */}
        {!isAuthenticated && (
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden mr-3 p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        )}

        {/* Logo */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2 mr-6">
          <span className="text-2xl leading-none">{brand.logo}</span>
          <span className="font-serif text-xl font-bold tracking-tight hidden sm:block">
            {brand.communityName}— {brand.communityNameBn}
          </span>
        </Link>

        {/* Community Switcher */}
        {isAuthenticated && !isPublicRoute && (
          <CommunitySwitcher />
        )}

        {/* Public nav links */}
        {!isAuthenticated && (
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {publicLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <ThemeToggle />

          {isAuthenticated ? (
            <>
              {/* Real-time Notifications Bell */}
              <NotificationBell />

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    aria-label="Open user menu"
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-secondary transition-colors outline-none"
                  >
                    <img 
                      src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} 
                      alt={user?.name ?? 'User avatar'}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20" 
                    />
                    <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-card border-border shadow-xl">
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold">{user?.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(`/members/${user?.id}`)} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" /> My Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => { logout(); navigate('/'); }} className="cursor-pointer text-destructive focus:bg-destructive/10">
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : null}
        </div>
      </div>

      {/* Mobile menu - public routes */}
      {!isAuthenticated && mobileMenuOpen && (
        <nav className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl px-4 py-3 space-y-1">
          {publicLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}