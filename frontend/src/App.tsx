import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { FindListings } from './pages/FindListings';
import { ListingDetail } from './pages/ListingDetail';
import { Auth } from './pages/Auth';
import { Pricing } from './pages/Pricing';
import { Contact } from './pages/Contact';
import { Events } from './pages/Events';
import { EventDetail } from './pages/EventDetail';
import { Blogs } from './pages/Blogs';
import { BlogDetail } from './pages/BlogDetail';
import { DashboardLayout } from './pages/dashboard/DashboardLayout';
import { DashboardOverview } from './pages/dashboard/Overview';
import { CreateListing } from './pages/dashboard/CreateListing';
import { MyListings } from './pages/dashboard/MyListings';
import { EditListing } from './pages/dashboard/EditListing';
import { CreateEvent } from './pages/dashboard/CreateEvent';
import { CreateBlog } from './pages/dashboard/CreateBlog';
import { EditBlog } from './pages/dashboard/EditBlog';
import { UserBlogs } from './pages/UserBlogs';
import { Analytics } from './pages/dashboard/Analytics';
import { Account } from './pages/dashboard/Account';
import { AdminCreateListing } from './pages/admin/CreateListing';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminOverview } from './pages/admin/AdminOverview';
import { PendingApprovals } from './pages/admin/PendingApprovals';
import { ManageEvents } from './pages/admin/ManageEvents';
import { ManageBlogs } from './pages/admin/ManageBlogs';
import { ManageUsers } from './pages/admin/ManageUsers';
import { ManageCategories } from './pages/admin/ManageCategories';
import { ManageListings } from './pages/admin/ManageListings';
import { Role } from './dto/auth.dto';
import { DefaultLayout } from './components/layout/DefaultLayout';
import { CreateEventAdmin } from './pages/admin/CreateEventAdmin';
import { CreateBlogAdmin } from './pages/admin/CreateBlogAdmin';
import { GoogleCallback } from './pages/GoogleCallback';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex min-h-screen flex-col bg-background">
          <Routes>
            {/* Public Routes */}
            <Route element={<DefaultLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/find-listings" element={<FindListings />} />
              <Route path="/listing/:id" element={<ListingDetail />} />
              <Route path="/events" element={<Events />} />
              <Route path="/event/:id" element={<EventDetail />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/signin" element={<Auth mode="signin" />} />
            <Route path="/signup" element={<Auth mode="signup" />} />
            <Route path="/google/callback" element={<GoogleCallback />} />

            {/* Member Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={[Role.MEMBER, Role.PREMIUM]}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardOverview />} />
              <Route path="listings" element={<MyListings />} />
              <Route path="edit-listing/:id" element={<EditListing />} />
              <Route path="new-listing" element={<CreateListing />} />
              <Route
                path="create-event"
                element={
                  <ProtectedRoute allowedRoles={[Role.PREMIUM]}>
                    <CreateEvent />
                  </ProtectedRoute>
                }
              />
              <Route path="create-blog" element={<CreateBlog />} />
              <Route path="my-blogs" element={<UserBlogs />} />
              <Route path="my-blogs/new" element={<EditBlog />} />
              <Route path="my-blogs/edit/:id" element={<EditBlog />} />
              <Route path="analytics" element={<Analytics />} />
              <Route
                path="payments"
                element={
                  <div className="flex min-h-screen items-center justify-center p-6">
                    <div className="text-center">
                      <h2 className="mb-2">Payments & Billing</h2>
                      <p className="text-muted-foreground">
                        Manage your subscription and billing
                      </p>
                    </div>
                  </div>
                }
              />
              <Route path="settings" element={<Account />} />
            </Route>

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={[Role.ADMIN]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminOverview />} />
              <Route path="new-listing" element={<AdminCreateListing />} />
              <Route path="pending" element={<PendingApprovals />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="categories" element={<ManageCategories />} />
              <Route path="listings" element={<ManageListings />} />
              <Route path="events" element={<ManageEvents />} />
              <Route path="create-event" element={<CreateEventAdmin />} />
              <Route path="blogs" element={<ManageBlogs />} />
              <Route path="create-blog" element={<CreateBlogAdmin />} />
              <Route
                path="moderation"
                element={
                  <div className="flex min-h-screen items-center justify-center p-6">
                    <div className="text-center">
                      <h2 className="mb-2">Content Moderation</h2>
                      <p className="text-muted-foreground">
                        Review and moderate user content
                      </p>
                    </div>
                  </div>
                }
              />
              <Route
                path="featured"
                element={
                  <div className="flex min-h-screen items-center justify-center p-6">
                    <div className="text-center">
                      <h2 className="mb-2">Featured Listings</h2>
                      <p className="text-muted-foreground">
                        Manage featured content priorities
                      </p>
                    </div>
                  </div>
                }
              />
              <Route
                path="payments"
                element={
                  <div className="flex min-h-screen items-center justify-center p-6">
                    <div className="text-center">
                      <h2 className="mb-2">Payment Reconciliation</h2>
                      <p className="text-muted-foreground">
                        Track and manage platform payments
                      </p>
                    </div>
                  </div>
                }
              />
              <Route
                path="analytics"
                element={
                  <div className="flex min-h-screen items-center justify-center p-6">
                    <div className="text-center">
                      <h2 className="mb-2">Platform Analytics</h2>
                      <p className="text-muted-foreground">
                        View platform performance metrics
                      </p>
                    </div>
                  </div>
                }
              />
              <Route
                path="settings"
                element={
                  <div className="flex min-h-screen items-center justify-center p-6">
                    <div className="text-center">
                      <h2 className="mb-2">Site Settings</h2>
                      <p className="text-muted-foreground">
                        Configure platform settings
                      </p>
                    </div>
                  </div>
                }
              />
            </Route>

            {/* 404 */}
            <Route
              path="*"
              element={
                  <main className="flex flex-1 items-center justify-center p-6">
                    <div className="text-center">
                      <h1 className="mb-2">404</h1>
                      <h2 className="mb-4">Page Not Found</h2>
                      <p className="mb-6 text-muted-foreground">
                        The page you're looking for doesn't exist.
                      </p>
                      <a href="/" className="text-primary hover:underline">
                        Go back home
                      </a>
                    </div>
                  </main>
              }
            />
          </Routes>

          <Toaster />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
