import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
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
import { EditBlog } from './pages/dashboard/EditBlog'; // Updated import path
import { UserBlogs } from './pages/UserBlogs'; // New import
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
import { Role } from './dto/auth.dto';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex min-h-screen flex-col bg-background">
          <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <main className="flex-1">
                  <Home />
                </main>
                <Footer />
              </>
            }
          />
          <Route
            path="/find-listings"
            element={
              <>
                <Navbar />
                <main className="flex-1">
                  <FindListings />
                </main>
                <Footer />
              </>
            }
          />
          <Route
            path="/listing/:id"
            element={
              <>
                <Navbar />
                <main className="flex-1">
                  <ListingDetail />
                </main>
                <Footer />
              </>
            }
          />
          <Route
            path="/events"
            element={
              <>
                <Navbar />
                <main className="flex-1">
                  <Events />
                </main>
                <Footer />
              </>
            }
          />
          <Route
            path="/event/:id"
            element={
              <>
                <Navbar />
                <main className="flex-1">
                  <EventDetail />
                </main>
                <Footer />
              </>
            }
          />
          <Route
            path="/blogs"
            element={
              <>
                <Navbar />
                <main className="flex-1">
                  <Blogs />
                </main>
                <Footer />
              </>
            }
          />
          <Route
            path="/blog/:id"
            element={
              <>
                <Navbar />
                <main className="flex-1">
                  <BlogDetail />
                </main>
                <Footer />
              </>
            }
          />
          <Route path="/pricing" element={
            <>
              <Navbar />
              <main className="flex-1">
                <Pricing />
              </main>
              <Footer />
            </>
          } />
          <Route path="/contact" element={
            <>
              <Navbar />
              <main className="flex-1">
                <Contact />
              </main>
              <Footer />
            </>
          } />

          {/* Auth Routes */}
          <Route path="/signin" element={<Auth mode="signin" />} />
          <Route path="/signup" element={<Auth mode="signup" />} />

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
            <Route path="create-event" element={<CreateEvent />} />
            <Route path="create-blog" element={<CreateBlog />} />
            <Route path="my-blogs" element={<UserBlogs />} />
            <Route path="my-blogs/new" element={<EditBlog />} />
            <Route path="my-blogs/edit/:id" element={<EditBlog />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="payments" element={
              <div className="flex min-h-screen items-center justify-center p-6">
                <div className="text-center">
                  <h2 className="mb-2">Payments & Billing</h2>
                  <p className="text-muted-foreground">Manage your subscription and billing</p>
                </div>
              </div>
            } />
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
            <Route path="events" element={<ManageEvents />} />
            <Route path="blogs" element={<ManageBlogs />} />
            <Route path="moderation" element={
              <div className="flex min-h-screen items-center justify-center p-6">
                <div className="text-center">
                  <h2 className="mb-2">Content Moderation</h2>
                  <p className="text-muted-foreground">Review and moderate user content</p>
                </div>
              </div>
            } />
            <Route path="featured" element={
              <div className="flex min-h-screen items-center justify-center p-6">
                <div className="text-center">
                  <h2 className="mb-2">Featured Listings</h2>
                  <p className="text-muted-foreground">Manage featured content priorities</p>
                </div>
              </div>
            } />
            <Route path="payments" element={
              <div className="flex min-h-screen items-center justify-center p-6">
                <div className="text-center">
                  <h2 className="mb-2">Payment Reconciliation</h2>
                  <p className="text-muted-foreground">Track and manage platform payments</p>
                </div>
              </div>
            } />
            <Route path="analytics" element={
              <div className="flex min-h-screen items-center justify-center p-6">
                <div className="text-center">
                  <h2 className="mb-2">Platform Analytics</h2>
                  <p className="text-muted-foreground">View platform performance metrics</p>
                </div>
              </div>
            } />
            <Route path="settings" element={
              <div className="flex min-h-screen items-center justify-center p-6">
                <div className="text-center">
                  <h2 className="mb-2">Site Settings</h2>
                  <p className="text-muted-foreground">Configure platform settings</p>
                </div>
              </div>
            } />
          </Route>

          {/* 404 */}
          <Route
            path="*"
            element={
              <>
                <Navbar />
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
                <Footer />
              </>
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
