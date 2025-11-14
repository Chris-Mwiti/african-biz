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
  getAdminListings,
  upgradeListingToPremium,
  updateListing,
  deleteListing,
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
import { UpdateListingStatusDto, UpdateListingDto } from '../dto/listing.dto';
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

// Listing Management
router.get('/listings', getAdminListings);
router.get('/pending-listings', getPendingListings);
router.put('/listings/:id/approve',approveListing); // Status will be 'APPROVED'
router.put('/listings/:id/reject',rejectListing); // Status will be 'REJECTED'
router.put('/listings/:id/upgrade', upgradeListingToPremium);
router.put('/listings/:id', validationMiddleware(UpdateListingDto), updateListing);
router.delete('/listings/:id', deleteListing);


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
