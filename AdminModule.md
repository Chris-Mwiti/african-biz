# Admin Module Development Guide

This document outlines the current state of the Admin Module in the African Yellow Pages application, identifies areas for improvement, and provides a step-by-step guide for its development and enhancement. The goal is to transform the currently mocked admin panel into a fully functional and responsive system.

## 1. Overview of the Admin Module

The Admin Module provides a centralized interface for administrators to manage various aspects of the African Yellow Pages platform. This includes overseeing user accounts, managing listings, events, blog posts, categories, and reviewing pending approvals.

## 2. Frontend Analysis Summary

The frontend admin panel is built with React and utilizes `shadcn/ui` components for its user interface. While the structure and UI elements are in place, a significant portion of the data and operations are currently mocked using `mockData.ts`.

**Key Components Reviewed:**

*   `AdminLayout.tsx`: Provides the overall layout, sidebar navigation, and header. Displays hardcoded admin info and quick stats.
*   `AdminOverview.tsx`: Presents a dashboard with various platform statistics, recent activities, and quick action links. Almost all data is mocked.
*   `ManageBlogs.tsx`: Interface for managing blog posts (create, view, edit, delete). Operations are mocked.
*   `ManageCategories.tsx`: Interface for managing listing categories (create, view, edit, delete). This component is already well-integrated with backend services.
*   `ManageEvents.tsx`: Interface for managing events (create, view, edit, delete). Operations are mocked.
*   `ManageUsers.tsx`: Interface for managing user accounts (view, search, deactivate/activate, delete). Operations are mocked, and search is client-side.
*   `PendingApprovals.tsx`: Interface for reviewing and acting on pending business listings. Operations are mocked.

## 3. Backend Analysis Summary

The backend is a Node.js application with Express and Prisma. To support the admin panel, several new endpoints, controllers, and DTOs will be required to replace the mocked frontend data and operations.

**Required Backend Components:**

*   **Endpoints:**
    *   `GET /admin/stats`: Dashboard statistics (total users, active users, pending approvals, etc.).
    *   `GET /admin/profile`: Authenticated admin user details.
    *   `GET /admin/overview-stats`: Comprehensive overview statistics for the dashboard.
    *   `GET /admin/recent-activity`: List of recent platform activities.
    *   `GET /admin/top-categories`: List of top categories with counts.
    *   `GET /admin/blogs`: All blog posts (with pagination/filtering).
    *   `POST /admin/blogs`: Create a new blog post.
    *   `PUT /admin/blogs/:id`: Update a blog post.
    *   `DELETE /admin/blogs/:id`: Delete a blog post.
    *   `GET /admin/categories`: All categories.
    *   `POST /admin/categories`: Create a new category.
    *   `PUT /admin/categories/:id`: Update a category.
    *   `DELETE /admin/categories/:id`: Delete a category.
    *   `GET /admin/events`: All events (with pagination/filtering).
    *   `POST /admin/events`: Create a new event.
    *   `PUT /admin/events/:id`: Update an event.
    *   `DELETE /admin/events/:id`: Delete an event.
    *   `GET /admin/users`: All users (with pagination/filtering/search).
    *   `PUT /admin/users/:id/status`: Update user status (activate/deactivate).
    *   `PUT /admin/users/:id/role`: Update user role.
    *   `DELETE /admin/users/:id`: Delete a user.
    *   `GET /admin/pending-listings`: All pending listings.
    *   `PUT /admin/listings/:id/approve`: Approve a listing.
    *   `PUT /admin/listings/:id/reject`: Reject a listing.

*   **Controllers:** Corresponding controller functions for each endpoint to handle business logic and Prisma interactions.
*   **DTOs:** Request and response DTOs for each endpoint to ensure data validation and clear API contracts.

## 4. Identified Bottlenecks and Issues (Consolidated)

1.  **Extensive Hardcoded Data:** Most admin panel components rely heavily on `mockData.ts`, making the panel static and non-functional with real data.
2.  **Mocked CRUD Operations:** All create, read, update, and delete operations (except for categories) are currently simulated on the frontend without backend interaction.
3.  **Lack of Dynamic Statistics:** Dashboard statistics (e.g., total users, pending approvals, revenue) are static.
4.  **Inefficient Data Fetching:** For tables displaying lists of items (blogs, events, users, pending listings), there's no server-side pagination, filtering, or sorting, which will lead to performance issues with large datasets.
5.  **Missing Image Upload Integration:** Forms that require image URLs (e.g., for blog banners, event banners) currently accept direct URLs, lacking a proper image upload mechanism.
6.  **Incomplete UI Actions:** Some UI elements like "Edit" buttons or "View Profile" links are present but lack implemented functionality.
7.  **Hardcoded Admin Information:** Admin user details in the layout are static.

## 5. Recommendations for Rectification (Step-by-Step Guide)

This section provides a detailed plan to implement the necessary backend and frontend changes.

---

### 5.1. Backend Development

The following steps outline the creation of necessary backend endpoints, controllers, and DTOs.

#### 5.1.1. Update `backend/src/dto/`

Ensure DTOs for all entities are correctly defined for creation, update, and filtering.

*   **`backend/src/dto/admin.dto.ts` (New File):**
    ```typescript
    // For dashboard stats
    export interface AdminOverviewStatsDto {
      totalUsers: number;
      activeUsers: number;
      premiumMembers: number;
      basicMembers: number;
      totalListings: number;
      pendingListings: number;
      premiumListings: number;
      verifiedListings: number;
      monthlyRevenue: number;
      // Add other relevant stats
    }

    // For recent activity
    export interface RecentActivityDto {
      id: string;
      type: 'listing' | 'event' | 'blog' | 'user';
      action: string; // e.g., 'created', 'updated', 'deleted', 'approved'
      description: string;
      user: string; // Name of the user who performed the action
      timestamp: string;
    }

    // For top categories
    export interface TopCategoryDto {
      id: string;
      name: string;
      listingCount: number;
    }
    ```

*   **`backend/src/dto/user.dto.ts` (Update Existing):**
    ```typescript
    // Add DTOs for admin user management
    export class UpdateUserStatusDto {
      @IsEnum(UserStatus)
      status: UserStatus;
    }

    export class UpdateUserRoleDto {
      @IsEnum(Role)
      role: Role;
    }

    // Define UserStatus enum if not already present
    export enum UserStatus {
      ACTIVE = 'ACTIVE',
      INACTIVE = 'INACTIVE',
      BANNED = 'BANNED',
    }
    ```
    *(Note: Ensure `UserStatus` and `Role` enums are defined in `schema.prisma` and imported/used correctly.)*

*   **`backend/src/dto/listing.dto.ts` (Update Existing):**
    ```typescript
    // Add DTOs for admin listing management
    export class UpdateListingStatusDto {
      @IsEnum(ApprovalStatus)
      status: ApprovalStatus;
    }
    ```
    *(Note: Ensure `ApprovalStatus` enum is defined in `schema.prisma` and imported/used correctly.)*

#### 5.1.2. Update `backend/src/controllers/`

Create new controller functions and modify existing ones to handle admin-specific logic.

*   **`backend/src/controllers/admin.controller.ts` (New/Update Existing):**
    ```typescript
    import { Request, Response } from 'express';
    import prisma from '../lib/prisma';
    import { Role, ApprovalStatus, UserStatus } from '@prisma/client'; // Assuming these enums are available from Prisma client

    // Get Admin Dashboard Overview Stats
    export const getAdminOverviewStats = async (req: Request, res: Response) => {
      try {
        const totalUsers = await prisma.user.count();
        const activeUsers = await prisma.user.count({ where: { status: UserStatus.ACTIVE } });
        const premiumMembers = await prisma.user.count({ where: { role: Role.PREMIUM } });
        const basicMembers = await prisma.user.count({ where: { role: Role.MEMBER } }); // Assuming 'MEMBER' is basic

        const totalListings = await prisma.listing.count();
        const pendingListings = await prisma.listing.count({ where: { status: ApprovalStatus.PENDING } });
        const premiumListings = await prisma.listing.count({ where: { is_premium: true } });
        const verifiedListings = await prisma.listing.count({ where: { verified: true } });

        // Placeholder for monthly revenue - needs actual payment integration
        const monthlyRevenue = 0; // TODO: Implement actual revenue calculation

        res.json({
          totalUsers,
          activeUsers,
          premiumMembers,
          basicMembers,
          totalListings,
          pendingListings,
          premiumListings,
          verifiedListings,
          monthlyRevenue,
        });
      } catch (error) {
        res.status(500).json({ message: 'Error fetching admin overview stats', error });
      }
    };

    // Get Recent Activity (Placeholder - needs detailed implementation based on audit logs)
    export const getRecentActivity = async (req: Request, res: Response) => {
      try {
        // This would typically query an audit log or recent activity table
        // For now, return mock data or a simplified version
        const recentActivities = [
          // Example: Fetch last 5 created listings, events, blogs
        ];
        res.json(recentActivities);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching recent activity', error });
      }
    };

    // Get Top Categories
    export const getTopCategories = async (req: Request, res: Response) => {
      try {
        const topCategories = await prisma.category.findMany({
          include: {
            _count: {
              select: { listings: true },
            },
          },
          orderBy: {
            listings: {
              _count: 'desc',
            },
          },
          take: 5, // Top 5 categories
        });

        res.json(topCategories.map(cat => ({
          id: cat.id,
          name: cat.name,
          listingCount: cat._count.listings,
        })));
      } catch (error) {
        res.status(500).json({ message: 'Error fetching top categories', error });
      }
    };

    // Manage Users
    export const getAdminUsers = async (req: Request, res: Response) => {
      const { search, role, status, page = 1, pageSize = 10 } = req.query;
      const skip = (Number(page) - 1) * Number(pageSize);
      const take = Number(pageSize);

      const where: any = {};
      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { email: { contains: search as string, mode: 'insensitive' } },
        ];
      }
      if (role) {
        where.role = role as Role;
      }
      if (status) {
        where.status = status as UserStatus;
      }

      try {
        const users = await prisma.user.findMany({
          where,
          skip,
          take,
          include: {
            _count: {
              select: { listings: true },
            },
          },
          orderBy: {
            created_at: 'desc',
          },
        });
        const total = await prisma.user.count({ where });

        res.json({
          users: users.map(user => ({
            ...user,
            listings_count: user._count.listings,
          })),
          total,
          page: Number(page),
          pageSize: Number(pageSize),
          totalPages: Math.ceil(total / Number(pageSize)),
        });
      } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
      }
    };

    export const updateUserStatus = async (req: Request, res: Response) => {
      const { id } = req.params;
      const { status } = req.body; // Expects { status: 'ACTIVE' | 'INACTIVE' | 'BANNED' }

      try {
        const updatedUser = await prisma.user.update({
          where: { id },
          data: { status },
        });
        res.json(updatedUser);
      } catch (error) {
        res.status(500).json({ message: 'Error updating user status', error });
      }
    };

    export const updateUserRole = async (req: Request, res: Response) => {
      const { id } = req.params;
      const { role } = req.body; // Expects { role: 'MEMBER' | 'PREMIUM' | 'ADMIN' }

      try {
        const updatedUser = await prisma.user.update({
          where: { id },
          data: { role },
        });
        res.json(updatedUser);
      } catch (error) {
        res.status(500).json({ message: 'Error updating user role', error });
      }
    };

    export const deleteUser = async (req: Request, res: Response) => {
      const { id } = req.params;
      try {
        // Consider soft delete or ensure cascade deletes are handled by Prisma
        await prisma.user.delete({ where: { id } });
        res.status(204).send();
      } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
      }
    };

    // Manage Listings (Pending Approvals)
    export const getPendingListings = async (req: Request, res: Response) => {
      const { page = 1, pageSize = 10 } = req.query;
      const skip = (Number(page) - 1) * Number(pageSize);
      const take = Number(pageSize);

      try {
        const listings = await prisma.listing.findMany({
          where: { status: ApprovalStatus.PENDING },
          skip,
          take,
          include: {
            category: true,
            owner: true,
          },
          orderBy: {
            created_at: 'asc',
          },
        });
        const total = await prisma.listing.count({ where: { status: ApprovalStatus.PENDING } });

        res.json({
          listings: listings.map(listing => ({
            ...listing,
            owner_name: listing.owner.name,
            category_name: listing.category.name,
          })),
          total,
          page: Number(page),
          pageSize: Number(pageSize),
          totalPages: Math.ceil(total / Number(pageSize)),
        });
      } catch (error) {
        res.status(500).json({ message: 'Error fetching pending listings', error });
      }
    };

    export const approveListing = async (req: Request, res: Response) => {
      const { id } = req.params;
      try {
        const updatedListing = await prisma.listing.update({
          where: { id },
          data: { status: ApprovalStatus.APPROVED },
        });
        res.json(updatedListing);
      } catch (error) {
        res.status(500).json({ message: 'Error approving listing', error });
      }
    };

    export const rejectListing = async (req: Request, res: Response) => {
      const { id } = req.params;
      try {
        const updatedListing = await prisma.listing.update({
          where: { id },
          data: { status: ApprovalStatus.REJECTED },
        });
        res.json(updatedListing);
      } catch (error) {
        res.status(500).json({ message: 'Error rejecting listing', error });
      }
    };

    // Admin Blog Management (reusing existing blog controllers but ensuring admin access)
    // getBlogs, getBlogById, createBlog, updateBlog, deleteBlog from blog.controller.ts can be used
    // with AuthorizationGuard for ADMIN role.

    // Admin Event Management (reusing existing event controllers but ensuring admin access)
    // getEvents, getEventById, createEvent, updateEvent, deleteEvent from event.controller.ts can be used
    // with AuthorizationGuard for ADMIN role.

    // Admin Category Management (reusing existing category controllers but ensuring admin access)
    // getCategories, createCategory, updateCategory, deleteCategory from category.controller.ts can be used
    // with AuthorizationGuard for ADMIN role.
    ```

*   **`backend/src/controllers/blog.controller.ts` (Update Existing):**
    *   Ensure `createBlog`, `getBlogs`, `getBlogById`, `updateBlog`, `deleteBlog` are robust and can be used by admin. Add pagination/filtering to `getBlogs` if needed.

*   **`backend/src/controllers/event.controller.ts` (Update Existing):**
    *   Ensure `createEvent`, `getEvents`, `getEventById`, `updateEvent`, `deleteEvent` are robust and can be used by admin. Add pagination/filtering to `getEvents` if needed.

*   **`backend/src/controllers/category.controller.ts` (Update Existing):**
    *   Ensure `getCategories`, `createCategory`, `updateCategory`, `deleteCategory` are robust and can be used by admin.

#### 5.1.3. Update `backend/src/routes/`

Define new admin-specific routes and ensure existing routes have proper authorization.

*   **`backend/src/routes/admin.routes.ts` (New/Update Existing):**
    ```typescript
    import { Router } from 'express';
    import { authenticateToken } from '../middleware/auth.middleware';
    import { AuthorizationGuard } from '../guards/authorization.guard';
    import {
      getAdminOverviewStats,
      getRecentActivity,
      getTopCategories,
      getAdminUsers,
      updateUserStatus,
      updateUserRole,
      deleteUser,
      getPendingListings,
      approveListing,
      rejectListing,
    } from '../controllers/admin.controller';
    import {
      getBlogs,
      getBlogById,
      createBlog,
      updateBlog,
      deleteBlog,
    } from '../controllers/blog.controller'; // Reusing blog controllers
    import {
      getEvents,
      getEventById,
      createEvent,
      updateEvent,
      deleteEvent,
    } from '../controllers/event.controller'; // Reusing event controllers
    import {
      getCategories,
      createCategory,
      updateCategory,
      deleteCategory,
    } from '../controllers/category.controller'; // Reusing category controllers
    import { validationMiddleware } from '../middleware/validation.middleware';
    import { UpdateUserStatusDto, UpdateUserRoleDto } from '../dto/user.dto';
    import { UpdateListingStatusDto } from '../dto/listing.dto';
    import { CreateBlogDto, UpdateBlogDto } from '../dto/blog.dto';
    import { CreateEventDto, UpdateEventDto } from '../dto/event.dto';
    import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';

    const router = Router();

    // All admin routes should be protected by authenticateToken and AuthorizationGuard for ADMIN role
    router.use(authenticateToken, AuthorizationGuard(['ADMIN']));

    // Dashboard Stats
    router.get('/overview-stats', getAdminOverviewStats);
    router.get('/recent-activity', getRecentActivity);
    router.get('/top-categories', getTopCategories);

    // User Management
    router.get('/users', getAdminUsers);
    router.put('/users/:id/status', validationMiddleware(UpdateUserStatusDto), updateUserStatus);
    router.put('/users/:id/role', validationMiddleware(UpdateUserRoleDto), updateUserRole);
    router.delete('/users/:id', deleteUser);

    // Listing Management (Pending Approvals)
    router.get('/pending-listings', getPendingListings);
    router.put('/listings/:id/approve', validationMiddleware(UpdateListingStatusDto), approveListing); // Status will be 'APPROVED'
    router.put('/listings/:id/reject', validationMiddleware(UpdateListingStatusDto), rejectListing); // Status will be 'REJECTED'

    // Blog Management (Admin specific - can reuse existing blog controllers)
    router.get('/blogs', getBlogs); // Potentially add admin-specific filters
    router.post('/blogs', validationMiddleware(CreateBlogDto), createBlog);
    router.get('/blogs/:id', getBlogById);
    router.put('/blogs/:id', validationMiddleware(UpdateBlogDto), updateBlog);
    router.delete('/blogs/:id', deleteBlog);

    // Event Management (Admin specific - can reuse existing event controllers)
    router.get('/events', getEvents); // Potentially add admin-specific filters
    router.post('/events', validationMiddleware(CreateEventDto), createEvent);
    router.get('/events/:id', getEventById);
    router.put('/events/:id', validationMiddleware(UpdateEventDto), updateEvent);
    router.delete('/events/:id', deleteEvent);

    // Category Management (Admin specific - can reuse existing category controllers)
    router.get('/categories', getCategories);
    router.post('/categories', validationMiddleware(CreateCategoryDto), createCategory);
    router.put('/categories/:id', validationMiddleware(UpdateCategoryDto), updateCategory);
    router.delete('/categories/:id', deleteCategory);

    export default router;
    ```

#### 5.1.4. Update `backend/src/index.ts`

Ensure the new admin routes are registered.

```typescript
// backend/src/index.ts
import adminRoutes from './routes/admin.routes'; // Ensure this is imported

// ... other app.use calls
app.use('/api/v1/admin', adminRoutes); // Register admin routes
```

---

### 5.2. Frontend Development

The following steps outline the creation of necessary frontend services and updates to components.

#### 5.2.1. Update `frontend/src/lib/types.ts`

Ensure all necessary interfaces are defined.

```typescript
// frontend/src/lib/types.ts
// ... existing types

export interface AdminOverviewStats {
  totalUsers: number;
  activeUsers: number;
  premiumMembers: number;
  basicMembers: number;
  totalListings: number;
  pendingListings: number;
  premiumListings: number;
  verifiedListings: number;
  monthlyRevenue: number;
}

export interface RecentActivity {
  id: string;
  type: 'listing' | 'event' | 'blog' | 'user';
  action: string;
  description: string;
  user: string;
  timestamp: string;
}

export interface TopCategory {
  id: string;
  name: string;
  listingCount: number;
}

// For User Management
export interface AdminUser extends User { // Extend existing User type
  listings_count: number;
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED'; // Assuming UserStatus enum
}

// For Listing Management (Pending Approvals)
export interface AdminListing extends Listing { // Extend existing Listing type
  owner_name: string;
  category_name: string;
}
```

#### 5.2.2. Update `frontend/src/services/`

Create new React Query hooks for fetching and mutating admin-specific data.

*   **`frontend/src/services/admin.service.ts` (New File):**
    ```typescript
    import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
    import api from '../api';
    import {
      AdminOverviewStats,
      RecentActivity,
      TopCategory,
      AdminUser,
      AdminListing,
    } from '../lib/types';
    import { UpdateUserStatusDto, UpdateUserRoleDto } from '../dto/user.dto';
    import { UpdateListingStatusDto } from '../dto/listing.dto';

    // Dashboard Stats
    export const useGetAdminOverviewStats = () => {
      return useQuery<AdminOverviewStats, Error>({
        queryKey: ['adminOverviewStats'],
        queryFn: async () => {
          const { data } = await api.get('/admin/overview-stats');
          return data;
        },
      });
    };

    export const useGetRecentActivity = () => {
      return useQuery<RecentActivity[], Error>({
        queryKey: ['recentActivity'],
        queryFn: async () => {
          const { data } = await api.get('/admin/recent-activity');
          return data;
        },
      });
    };

    export const useGetTopCategories = () => {
      return useQuery<TopCategory[], Error>({
        queryKey: ['topCategories'],
        queryFn: async () => {
          const { data } = await api.get('/admin/top-categories');
          return data;
        },
      });
    };

    // User Management
    export const useGetAdminUsers = (params?: { search?: string; role?: string; status?: string; page?: number; pageSize?: number }) => {
      return useQuery<{ users: AdminUser[]; total: number; page: number; pageSize: number; totalPages: number }, Error>({
        queryKey: ['adminUsers', params],
        queryFn: async () => {
          const { data } = await api.get('/admin/users', { params });
          return data;
        },
      });
    };

    export const useUpdateUserStatus = () => {
      const queryClient = useQueryClient();
      return useMutation<AdminUser, Error, { id: string; status: UpdateUserStatusDto['status'] }>({
        mutationFn: async ({ id, status }) => {
          const { data } = await api.put(`/admin/users/${id}/status`, { status });
          return data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
        },
      });
    };

    export const useUpdateUserRole = () => {
      const queryClient = useQueryClient();
      return useMutation<AdminUser, Error, { id: string; role: UpdateUserRoleDto['role'] }>({
        mutationFn: async ({ id, role }) => {
          const { data } = await api.put(`/admin/users/${id}/role`, { role });
          return data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
        },
      });
    };

    export const useDeleteUser = () => {
      const queryClient = useQueryClient();
      return useMutation<void, Error, string>({
        mutationFn: async (id) => {
          await api.delete(`/admin/users/${id}`);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
        },
      });
    };

    // Listing Management (Pending Approvals)
    export const useGetPendingListings = (params?: { page?: number; pageSize?: number }) => {
      return useQuery<{ listings: AdminListing[]; total: number; page: number; pageSize: number; totalPages: number }, Error>({
        queryKey: ['pendingListings', params],
        queryFn: async () => {
          const { data } = await api.get('/admin/pending-listings', { params });
          return data;
        },
      });
    };

    export const useApproveListing = () => {
      const queryClient = useQueryClient();
      return useMutation<AdminListing, Error, string>({
        mutationFn: async (id) => {
          const { data } = await api.put(`/admin/listings/${id}/approve`, { status: 'APPROVED' });
          return data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['pendingListings'] });
          queryClient.invalidateQueries({ queryKey: ['adminOverviewStats'] }); // Update stats
        },
      });
    };

    export const useRejectListing = () => {
      const queryClient = useQueryClient();
      return useMutation<AdminListing, Error, string>({
        mutationFn: async (id) => {
          const { data } = await api.put(`/admin/listings/${id}/reject`, { status: 'REJECTED' });
          return data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['pendingListings'] });
          queryClient.invalidateQueries({ queryKey: ['adminOverviewStats'] }); // Update stats
        },
      });
    };

    // Blog Management (Admin) - Reuse existing blog.service.ts hooks, but ensure they are called with admin privileges if needed
    // Event Management (Admin) - Reuse existing event.service.ts hooks
    // Category Management (Admin) - Reuse existing category.service.ts hooks
    ```

#### 5.2.3. Update `frontend/src/pages/admin/` Components

Integrate the new services and dynamic data into the admin components.

*   **`frontend/src/pages/admin/AdminLayout.tsx`:**
    *   Fetch admin user details from `useAuth()` (if available) or a new `useGetAdminProfile()` hook.
    *   Fetch pending approvals count from `useGetAdminOverviewStats()` to dynamically update the `badge` in navigation.
    *   Update hardcoded admin email/name with dynamic data.

*   **`frontend/src/pages/admin/AdminOverview.tsx`:**
    *   Replace `mockListings`, `mockUser`, `mockEvents`, `mockBlogs` with data from `useGetAdminOverviewStats()`, `useGetRecentActivity()`, and `useGetTopCategories()`.
    *   Update all statistics and activity lists to display dynamic data.

*   **`frontend/src/pages/admin/ManageBlogs.tsx`:**
    *   Replace `mockBlogs` with data from `useGetAdminBlogs()` (a new hook or an enhanced `useGetBlogs` that accepts admin filters).
    *   Implement `useCreateAdminBlog()`, `useUpdateAdminBlog()`, `useDeleteAdminBlog()` for CRUD operations.
    *   Add proper form handling for editing blogs (either in a dialog or a separate page).

*   **`frontend/src/pages/admin/ManageCategories.tsx`:**
    *   This component is largely functional. Ensure `Category` interface is imported from `frontend/src/lib/types.ts` or `frontend/src/dto/category.dto.ts`.

*   **`frontend/src/pages/admin/ManageEvents.tsx`:**
    *   Replace `mockEvents` with data from `useGetAdminEvents()` (a new hook or an enhanced `useGetEvents` that accepts admin filters).
    *   Implement `useCreateAdminEvent()`, `useUpdateAdminEvent()`, `useDeleteAdminEvent()` for CRUD operations.
    *   Add proper form handling for editing events.

*   **`frontend/src/pages/admin/ManageUsers.tsx`:**
    *   Replace `mockUsers` with data from `useGetAdminUsers()`.
    *   Implement `useUpdateUserStatus()` and `useDeleteUser()` for user actions.
    *   Enhance search to use server-side filtering via `useGetAdminUsers()` parameters.
    *   Add functionality to update user roles using `useUpdateUserRole()`.

*   **`frontend/src/pages/admin/PendingApprovals.tsx`:**
    *   Replace `mockListings` with data from `useGetPendingListings()`.
    *   Implement `useApproveListing()` and `useRejectListing()` for approval actions.
    *   Implement navigation to `ListingDetail.tsx` when "Eye" icon is clicked.

---

### 5.3. General Improvements and Bottleneck Solutions

1.  **Pagination, Filtering, and Sorting:**
    *   **Backend:** Implement query parameters (`page`, `pageSize`, `sort`, `filter`) in all `GET` endpoints for lists (users, blogs, events, pending listings).
    *   **Frontend:** Integrate these parameters into the `useQuery` hooks and add UI controls (pagination components, search inputs, filter dropdowns, sort headers) to the respective tables.
2.  **Image Uploads:**
    *   **Backend:** Create a dedicated file upload endpoint (e.g., `/upload/image`) that handles storing images (e.g., to Cloudinary, S3) and returns the URL.
    *   **Frontend:** Integrate an image upload component (e.g., `CloudinaryUploadWidget.tsx` if it exists, or a new one) into forms that require image inputs. Replace direct URL inputs with this component.
3.  **Error Handling and User Feedback:**
    *   **Frontend:** Ensure all API calls have robust error handling and provide clear, user-friendly feedback using `toast` notifications.
4.  **Authorization:**
    *   **Backend:** Double-check that all admin endpoints are protected by `authenticateToken` and `AuthorizationGuard(['ADMIN'])`.
    *   **Frontend:** The `ProtectedRoute` component already handles route protection.

---

## 6. Implementation Steps (Order of Operations)

1.  **Backend DTOs:** Create/Update `admin.dto.ts`, `user.dto.ts`, `listing.dto.ts` in `backend/src/dto/`.
2.  **Backend Controllers:** Implement `admin.controller.ts` with `getAdminOverviewStats`, `getRecentActivity`, `getTopCategories`, `getAdminUsers`, `updateUserStatus`, `updateUserRole`, `deleteUser`, `getPendingListings`, `approveListing`, `rejectListing`.
3.  **Backend Routes:** Create/Update `admin.routes.ts` to define all admin endpoints and apply `authenticateToken` and `AuthorizationGuard(['ADMIN'])`.
4.  **Backend `index.ts`:** Register `admin.routes.ts`.
5.  **Frontend Types:** Update `frontend/src/lib/types.ts` with `AdminOverviewStats`, `RecentActivity`, `TopCategory`, `AdminUser`, `AdminListing` interfaces.
6.  **Frontend Services:** Create `frontend/src/services/admin.service.ts` with all necessary React Query hooks.
7.  **Frontend `AdminLayout.tsx`:** Integrate `useAuth()` for admin user info and `useGetAdminOverviewStats()` for pending approvals badge.
8.  **Frontend `AdminOverview.tsx`:** Integrate `useGetAdminOverviewStats()`, `useGetRecentActivity()`, `useGetTopCategories()` to display dynamic data.
9.  **Frontend `ManageUsers.tsx`:** Integrate `useGetAdminUsers()`, `useUpdateUserStatus()`, `useUpdateUserRole()`, `useDeleteUser()`. Implement server-side search/pagination.
10. **Frontend `PendingApprovals.tsx`:** Integrate `useGetPendingListings()`, `useApproveListing()`, `useRejectListing()`. Implement "View" functionality.
11. **Frontend `ManageBlogs.tsx`:** Integrate admin-specific blog services (or enhance existing ones). Implement full CRUD.
12. **Frontend `ManageEvents.tsx`:** Integrate admin-specific event services (or enhance existing ones). Implement full CRUD.
13. **Image Upload Integration:** Implement a generic image upload solution and integrate it into relevant forms.
14. **Refinement:** Add pagination, filtering, and sorting UI to all tables. Improve error handling and user feedback across the module.
