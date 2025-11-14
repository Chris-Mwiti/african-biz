import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckCircle2,
  Users,
  Shield,
  CreditCard,
  Settings,
  Star,
  Calendar,
  FileText,
  LogOut,
  X,
  Bell,
  User,
  Activity,
  TrendingUp,
  PlusSquare,
  MenuIcon,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../components/ui/utils';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Menu } from '@headlessui/react';
import { useAuth } from '../../contexts/AuthContext';
import { useGetAdminOverviewStats } from '../../services/admin.service';

const navigation = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Pending Approvals', href: '/admin/pending', icon: CheckCircle2, badge: 0 }, // Default badge to 0
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Categories', href: '/admin/categories', icon: Settings },
  { name: 'Manage Listings', href: '/admin/listings', icon: Star },
  { name: 'Create Listing', href: '/admin/new-listing', icon: PlusSquare },
  { name: 'Manage Events', href: '/admin/events', icon: Calendar },
  { name: 'Create Event', href: '/admin/create-event', icon: PlusSquare },
  { name: 'Manage Blog Posts', href: '/admin/blogs', icon: FileText },
  { name: 'Create Blog Post', href: '/admin/create-blog', icon: PlusSquare },
  { name: 'Content Moderation', href: '/admin/moderation', icon: Shield },
  { name: 'Featured Listings', href: '/admin/featured', icon: Star },
  { name: 'Payments', href: '/admin/payments', icon: CreditCard },
  { name: 'Analytics', href: '/admin/analytics', icon: TrendingUp },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth(); // Get user from AuthContext
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: overviewStats, isLoading: statsLoading } = useGetAdminOverviewStats();

  // Update pending approvals badge dynamically
  if (overviewStats && navigation[1].name === 'Pending Approvals') {
    navigation[1].badge = overviewStats.pendingListings;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    // Redirect to login if user is not authenticated (should be handled by ProtectedRoute too)
    navigate('/signin');
    return null;
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 transform border-r bg-card transition-transform duration-200 ease-in-out lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex h-16 items-center justify-between border-b px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm">Admin Panel</h3>
                <p className="text-xs text-muted-foreground">African Yellow Pages</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Admin Badge */}
          <div className="border-b bg-gradient-to-r from-primary/10 to-accent/10 p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-primary">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.name.charAt(0).toUpperCase()}{user.name.charAt(1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm">{user.name}</p>
                <Badge variant="secondary" className="mt-1 bg-primary/10 text-primary">
                  <Shield className="mr-1 h-3 w-3" />
                  Full Access
                </Badge>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="border-b p-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border bg-card p-3">
                <div className="flex items-center justify-between">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Active Users</span>
                </div>
                <p className="mt-1 text-xl">{statsLoading ? '...' : overviewStats?.activeUsers || 0}</p>
              </div>
              <div className="rounded-lg border bg-card p-3">
                <div className="flex items-center justify-between">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  <span className="text-xs text-muted-foreground">Pending Listings</span>
                </div>
                <p className="mt-1 text-xl">{statsLoading ? '...' : overviewStats?.pendingListings || 0}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="flex-1">{item.name}</span>
                  {item.badge !== undefined && (
                    <Badge 
                      variant={isActive ? 'secondary' : 'default'}
                      className={cn(
                        'ml-auto',
                        !isActive && 'bg-accent text-accent-foreground'
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="border-t p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card px-4 sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon className="h-5 w-5" />
          </Button>

          <div className="flex-1">
            <h1 className="text-lg">Admin Dashboard</h1>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/">
                View Site
              </Link>
            </Button>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
            </Button>

            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button as={Button} variant="ghost" size="icon">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.name.charAt(0).toUpperCase()}{user.name.charAt(1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Menu.Button>
              </div>
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-1 py-1">
                  <div className="px-2 py-2">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/admin/settings"
                        className={`${
                          active ? 'bg-violet-500 text-white' : 'text-gray-900'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Admin Settings
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/"
                        className={`${
                          active ? 'bg-violet-500 text-white' : 'text-gray-900'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        <Activity className="mr-2 h-4 w-4" />
                        View Live Site
                      </Link>
                    )}
                  </Menu.Item>
                </div>
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`${
                          active ? 'bg-violet-500 text-white' : 'text-gray-900'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Menu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
