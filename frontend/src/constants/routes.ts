/**
 * Application route constants
 */

// Public routes
export const ROUTES = {
  HOME: '/home',
  FIND_LISTINGS: '/home/find-listings',
  LISTING_DETAIL: (id: string) => `/home/listing/${id}`,
  EVENTS: '/home/events',
  BLOGS: '/home/blogs',
  PRICING: '/home/pricing',
  CONTACT: '/home/contact',
  SIGNIN: '/signin',
  SIGNUP: '/signup',
  
  // Dashboard routes
  DASHBOARD: '/dashboard',
  DASHBOARD_LISTINGS: '/dashboard/listings',
  DASHBOARD_NEW_LISTING: '/dashboard/new-listing',
  DASHBOARD_EVENTS: '/dashboard/events',
  DASHBOARD_BLOGS: '/dashboard/blogs',
  DASHBOARD_ANALYTICS: '/dashboard/analytics',
  DASHBOARD_PAYMENTS: '/dashboard/payments',
  DASHBOARD_SETTINGS: '/dashboard/settings',
  
  // Admin routes
  ADMIN: '/admin',
  ADMIN_PENDING: '/admin/pending',
  ADMIN_USERS: '/admin/users',
  ADMIN_EVENTS: '/admin/events',
  ADMIN_BLOGS: '/admin/blogs',
  ADMIN_MODERATION: '/admin/moderation',
  ADMIN_FEATURED: '/admin/featured',
  ADMIN_PAYMENTS: '/admin/payments',
  ADMIN_SETTINGS: '/admin/settings',
} as const;
