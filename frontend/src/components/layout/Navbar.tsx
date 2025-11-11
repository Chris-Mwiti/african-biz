import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Search,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Plus,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '../ui/dropdown-menu';
import { useAuth } from '../../contexts/AuthContext';
import { Badge } from '../ui/badge';
import { ROUTES } from '../../constants/routes';
import { getInitials } from '../../utils/formatters';
import { Role } from '@/dto/auth.dto';

interface NavbarProps {
  onSearch?: (query: string) => void;
}

export function Navbar({ onSearch }: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b bg-secondary backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2 shrink-0 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm transition-transform group-hover:scale-105">
              <img src='../../../assets/african-yellow-pages/apple-icon-76x76.png' />
            </div>
            <div className="hidden flex-col sm:flex">
              <span className="font-semibold leading-tight text-secondary-foreground transition-colors group-hover:text-primary">
                African Yellow Pages
              </span>
              <span className="text-xs text-secondary-foreground/70">USA</span>
            </div>
          </Link>

          {/* Desktop Search */}
          <form
            onSubmit={handleSearch}
            className="hidden flex-1 max-w-lg lg:block"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search businesses, events, or blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-lg border border-secondary-foreground/20 bg-white pl-10 pr-4 transition-shadow focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </form>

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-1 lg:flex">
            <Button 
              asChild 
              variant={isActive(ROUTES.HOME) ? 'default' : 'ghost'} 
              size="sm"
              className={isActive(ROUTES.HOME) ? '' : 'text-secondary-foreground hover:text-primary hover:bg-white/20'}
            >
              <Link to={ROUTES.HOME}>Home</Link>
            </Button>
            <Button 
              asChild 
              variant={isActive(ROUTES.FIND_LISTINGS) ? 'default' : 'ghost'} 
              size="sm"
              className={isActive(ROUTES.FIND_LISTINGS) ? '' : 'text-secondary-foreground hover:text-primary hover:bg-white/20'}
            >
              <Link to={ROUTES.FIND_LISTINGS}>Find Listings</Link>
            </Button>
            <Button 
              asChild 
              variant={isActive(ROUTES.EVENTS) ? 'default' : 'ghost'} 
              size="sm"
              className={isActive(ROUTES.EVENTS) ? '' : 'text-secondary-foreground hover:text-primary hover:bg-white/20'}
            >
              <Link to={ROUTES.EVENTS}>Events</Link>
            </Button>
            <Button 
              asChild 
              variant={isActive(ROUTES.BLOGS) ? 'default' : 'ghost'} 
              size="sm"
              className={isActive(ROUTES.BLOGS) ? '' : 'text-secondary-foreground hover:text-primary hover:bg-white/20'}
            >
              <Link to={ROUTES.BLOGS}>Blogs</Link>
            </Button>
            <Button 
              asChild 
              variant={isActive(ROUTES.PRICING) ? 'default' : 'ghost'} 
              size="sm"
              className={isActive(ROUTES.PRICING) ? '' : 'text-secondary-foreground hover:text-primary hover:bg-white/20'}
            >
              <Link to={ROUTES.PRICING}>Pricing</Link>
            </Button>
            <Button 
              asChild 
              variant={isActive(ROUTES.CONTACT) ? 'default' : 'ghost'} 
              size="sm"
              className={isActive(ROUTES.CONTACT) ? '' : 'text-secondary-foreground hover:text-primary hover:bg-white/20'}
            >
              <Link to={ROUTES.CONTACT}>Contact</Link>
            </Button>

            {!isAuthenticated ? (
              <>
                <Button asChild variant="ghost" size="sm" className="text-secondary-foreground hover:text-primary hover:bg-white/20">
                  <Link to={ROUTES.SIGNIN}>Sign In</Link>
                </Button>
                <Button asChild size="sm" variant="default">
                  <Link to={ROUTES.SIGNUP}>Get Started</Link>
                </Button>
              </>
            ) : (
              <>
                {user?.role !== Role.ADMIN && (
                  <Button asChild variant="default" size="sm">
                    <Link to={ROUTES.DASHBOARD_NEW_LISTING}>
                      <Plus className="h-4 w-4" />
                      <span className="ml-2">Add Listing</span>
                    </Link>
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-9 w-9 rounded-full"
                    >
                      <Avatar className="h-9 w-9 ring-2 ring-transparent transition-all hover:ring-primary/20">
                        <AvatarImage
                          src={user?.profile_image}
                          alt={user?.name}
                        />
                        <AvatarFallback className="bg-primary/10">
                          {user?.name ? getInitials(user.name) : 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56 z-[100] bg-background border border-2">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="leading-none">
                          {user?.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                        {user?.role === Role.PREMIUM && (
                          <Badge variant="secondary" className="mt-1 w-fit text-xs">
                            Premium
                          </Badge>
                        )}
                        {user?.role === Role.ADMIN && (
                          <Badge className="mt-1 w-fit text-xs bg-primary">
                            <ShieldCheck className="mr-1 h-3 w-3" />
                            Admin
                          </Badge>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        to={user?.role === Role.ADMIN ? ROUTES.ADMIN : ROUTES.DASHBOARD}
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    {user?.role !== Role.ADMIN && (
                      <DropdownMenuItem asChild>
                        <Link to={ROUTES.DASHBOARD_SETTINGS}>
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t py-4 lg:hidden">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search businesses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-full rounded-lg border bg-background pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </form>

            {/* Mobile Links */}
            <div className="flex flex-col gap-2">
              <Button
                asChild
                variant={isActive(ROUTES.HOME) ? 'secondary' : 'ghost'}
                className="justify-start"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link to={ROUTES.HOME}>Home</Link>
              </Button>
              <Button
                asChild
                variant={isActive(ROUTES.FIND_LISTINGS) ? 'secondary' : 'ghost'}
                className="justify-start"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link to={ROUTES.FIND_LISTINGS}>Find Listings</Link>
              </Button>
              <Button
                asChild
                variant={isActive(ROUTES.EVENTS) ? 'secondary' : 'ghost'}
                className="justify-start"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link to={ROUTES.EVENTS}>Events</Link>
              </Button>
              <Button
                asChild
                variant={isActive(ROUTES.BLOGS) ? 'secondary' : 'ghost'}
                className="justify-start"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link to={ROUTES.BLOGS}>Blogs</Link>
              </Button>
              <Button
                asChild
                variant={isActive(ROUTES.PRICING) ? 'secondary' : 'ghost'}
                className="justify-start"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link to={ROUTES.PRICING}>Pricing</Link>
              </Button>
              <Button
                asChild
                variant={isActive(ROUTES.CONTACT) ? 'secondary' : 'ghost'}
                className="justify-start"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link to={ROUTES.CONTACT}>Contact</Link>
              </Button>

              {!isAuthenticated ? (
                <>
                  <div className="my-2 h-px bg-border" />
                  <Button asChild variant="outline" onClick={() => setMobileMenuOpen(false)}>
                    <Link to={ROUTES.SIGNIN}>Sign In</Link>
                  </Button>
                  <Button asChild onClick={() => setMobileMenuOpen(false)}>
                    <Link to={ROUTES.SIGNUP}>Get Started</Link>
                  </Button>
                </>
              ) : (
                <>
                  <div className="my-2 h-px bg-border" />
                  {user?.role !== Role.ADMIN && (
                    <Button asChild className="justify-start" onClick={() => setMobileMenuOpen(false)}>
                      <Link to={ROUTES.DASHBOARD_NEW_LISTING}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Listing
                      </Link>
                    </Button>
                  )}
                  <Button
                    asChild
                    variant="outline"
                    className="justify-start"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link
                      to={user?.role === Role.ADMIN ? ROUTES.ADMIN : ROUTES.DASHBOARD}
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </Button>
                  {user?.role !== Role.ADMIN && (
                    <Button
                      asChild
                      variant="outline"
                      className="justify-start"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link to={ROUTES.DASHBOARD_SETTINGS}>
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    className="justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
