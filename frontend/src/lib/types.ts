import { UserDto } from "@/dto/auth.dto";

// Re-export DTOs to be used in the frontend
export type { SignUpDto, LoginDto, UserDto } from "@/dto/auth.dto";
export type User = UserDto;

export type ListingStatus = 'DRAFT' | 'PENDING' | 'ACTIVE' | 'REJECTED';
export type UserRole = ""

export interface Listing {
  id: string;
  owner_id: string;
  owner_name: string;
  title: string;
  description: string;
  category_id: string;
  category: { id: string; name: string };
  address: string;
  country: string;
  city: string;
  phone: string;
  email: string;
  website: string;
  social_links: { platform: string; url: string }[];
  images: string[];
  is_premium: boolean;
  is_featured: boolean;
  status: ListingStatus;
  featured_priority: number;
  views_count: number;
  rating: number;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface Event {
  id: string;
  listing_id: string;
  listing: Listing;
  title: string;
  description: string;
  start_datetime: string;
  end_datetime: string;
  location: string;
  banner_image: string;
  creator_id: string;
  creator: User;
  created_at: string;
}

export interface BlogPost {
  id: string;
  listing_id: string;
  listing: Listing;
  author_id: string;
  author: User;
  title: string;
  content: string;
  excerpt: string;
  banner_image: string;
  tags: string[];
  published_date: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  status: string;
  plan: string;
  amount: number;
  started_at: string;
  ends_at: string;
  last_payment_at: string;
}

export interface Analytics {
  listing_id: string;
  views: number;
  clicks: number;
  contacts: number;
  period: '7d' | '30d' | '90d' | '365d';
  data: {
    date: string;
    views: number;
    clicks: number;
    contacts: number;
  }[];
}

// API Request/Response Types

export interface CreateListingResponse {
  success: boolean;
  listing: Listing;
  payment_required?: boolean;
  checkout_url?: string;
}

export interface SearchListingsRequest {
  q?: string;
  category?: string[];
  country?: string;
  city?: string;
  premium?: boolean;
  page?: number;
  perPage?: number;
}

export interface SearchListingsResponse {
  listings: Listing[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface PaymentCheckoutRequest {
  plan: 'premium';
  listing_id?: string;
  billing_period: 'monthly' | 'yearly';
}

export interface PaymentCheckoutResponse {
  success: boolean;
  checkout_url: string;
  session_id: string;
}

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

export interface Category {
  id: string;
  name: string;
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BANNED = 'BANNED',
}

export interface AdminUser extends User { // Extend existing User type
  listings_count: number;
  status: UserStatus; // Assuming UserStatus enum
}

export interface AdminListing extends Listing { // Extend existing Listing type
  owner_name: string;
  category_name: string;
}
