import { IsEnum } from 'class-validator';
import { Role, ApprovalStatus, UserStatus } from '@prisma/client';

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
