import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Search,
  Menu as MenuIcon,
  X,
  LogOut,
  LayoutDashboard,
  Plus,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuth } from '../../contexts/AuthContext';
import { Badge } from '../ui/badge';
import { ROUTES } from '../../constants/routes';
import { getInitials } from '../../utils/formatters';
import { Role } from '@/dto/auth.dto';
import { Menu } from '@headlessui/react';

interface NavbarProps {
  onSearch?: (query: string) => void;
}

export function Navbar({ onSearch }: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
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
            <div className="flex h-12 w-12 items-center justify-center rounded-lg   shadow-sm transition-transform group-hover:scale-105">
              <img src="/nav-icon5.png" className='size-40 rounded-lg' alt='AYP' />
            </div>
            <div className="hidden flex-col sm:flex">
              <span className="font-semibold leading-tight text-secondary-foreground transition-colors group-hover:text-primary">
                African Yellow Pages
              </span>
              <span className="text-xs text-secondary-foreground/70">USA</span>
            </div>
          </Link>

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

                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button as={Button} variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-9 w-9 ring-2 ring-transparent transition-all hover:ring-primary/20">
                        <AvatarImage
                          src={user?.profile_image}
                          alt={user?.name}
                        />
                        <AvatarFallback className="bg-primary/10">
                          {user?.name ? getInitials(user.name) : 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Menu.Button>
                  </div>
                  <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-[100]">
                    <div className="px-1 py-1">
                      <div className="px-2 py-2">
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
                    </div>
                    <div className="px-1 py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to={user?.role === Role.ADMIN ? ROUTES.ADMIN : ROUTES.DASHBOARD}
                            className={`${
                              active ? 'bg-violet-500 text-white' : 'text-gray-900'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Dashboard
                          </Link>
                        )}
                      </Menu.Item>
                      {user?.role !== Role.ADMIN && (
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to={ROUTES.DASHBOARD_SETTINGS}
                              className={`${
                                active ? 'bg-violet-500 text-white' : 'text-gray-900'
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            >
                              <Settings className="mr-2 h-4 w-4" />
                              Settings
                            </Link>
                          )}
                        </Menu.Item>
                      )}
                    </div>
                    <div className="px-1 py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={logout}
                            className={`${
                              active ? 'bg-violet-500 text-white' : 'text-red-900'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Menu>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button as={Button} variant="ghost" size="icon">
                  <MenuIcon className="h-6 w-6" />
                </Menu.Button>
              </div>
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-[100]">
                <div className="px-1 py-1">
                  <form onSubmit={handleSearch} className="p-2">
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
                </div>
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to={ROUTES.HOME}
                        className={`${
                          active ? 'bg-violet-500 text-white' : 'text-gray-900'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        Home
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to={ROUTES.FIND_LISTINGS}
                        className={`${
                          active ? 'bg-violet-500 text-white' : 'text-gray-900'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        Find Listings
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to={ROUTES.EVENTS}
                        className={`${
                          active ? 'bg-violet-500 text-white' : 'text-gray-900'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        Events
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to={ROUTES.BLOGS}
                        className={`${
                          active ? 'bg-violet-500 text-white' : 'text-gray-900'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        Blogs
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to={ROUTES.PRICING}
                        className={`${
                          active ? 'bg-violet-500 text-white' : 'text-gray-900'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        Pricing
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to={ROUTES.CONTACT}
                        className={`${
                          active ? 'bg-violet-500 text-white' : 'text-gray-900'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        Contact
                      </Link>
                    )}
                  </Menu.Item>
                </div>
                <div className="px-1 py-1">
                  {!isAuthenticated ? (
                    <>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to={ROUTES.SIGNIN}
                            className={`${
                              active ? 'bg-violet-500 text-white' : 'text-gray-900'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            Sign In
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to={ROUTES.SIGNUP}
                            className={`${
                              active ? 'bg-violet-500 text-white' : 'text-gray-900'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            Get Started
                          </Link>
                        )}
                      </Menu.Item>
                    </>
                  ) : (
                    <>
                      {user?.role !== Role.ADMIN && (
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to={ROUTES.DASHBOARD_NEW_LISTING}
                              className={`${
                                active ? 'bg-violet-500 text-white' : 'text-gray-900'
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add Listing
                            </Link>
                          )}
                        </Menu.Item>
                      )}
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to={user?.role === Role.ADMIN ? ROUTES.ADMIN : ROUTES.DASHBOARD}
                            className={`${
                              active ? 'bg-violet-500 text-white' : 'text-gray-900'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Dashboard
                          </Link>
                        )}
                      </Menu.Item>
                      {user?.role !== Role.ADMIN && (
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to={ROUTES.DASHBOARD_SETTINGS}
                              className={`${
                                active ? 'bg-violet-500 text-white' : 'text-gray-900'
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            >
                              <Settings className="mr-2 h-4 w-4" />
                              Settings
                            </Link>
                          )}
                        </Menu.Item>
                      )}
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={logout}
                            className={`${
                              active ? 'bg-violet-500 text-white' : 'text-red-900'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                          </button>
                        )}
                      </Menu.Item>
                    </>
                  )}
                </div>
              </Menu.Items>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  );
}
