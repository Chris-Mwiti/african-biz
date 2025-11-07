import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../api'; // Assuming api is your axios instance

// Define AnalyticEventType locally for frontend, or import from a shared types file
export enum AnalyticEventType {
  VIEW = 'VIEW',
  CLICK = 'CLICK',
  CONTACT = 'CONTACT',
}

interface TrackEventPayload {
  listingId: string;
  eventType: AnalyticEventType;
  details?: Record<string, any>; // Object for details
}

interface ListingAnalytics {
  listingId: string;
  listingTitle: string;
  views: number;
  clicks: number;
  contacts: number;
  eventsCount: number;
}

// --- API Calls ---

const trackAnalyticEventApi = async (payload: TrackEventPayload): Promise<void> => {
  await api.post('/analytics/track', {
    ...payload,
    details: payload.details ? JSON.stringify(payload.details) : undefined, // Stringify JSON for backend DTO
  });
};

const fetchUserListingsAnalyticsApi = async (): Promise<ListingAnalytics[]> => {
  const response = await api.get<ListingAnalytics[]>('/analytics');
  return response.data;
};

const fetchListingAnalyticsApi = async (listingId: string): Promise<ListingAnalytics> => {
  const response = await api.get<ListingAnalytics>(`/analytics/${listingId}`);
  return response.data;
};

// --- React Query Hooks ---

export const useTrackAnalyticEvent = () => {
  return useMutation<void, Error, TrackEventPayload>({
    mutationFn: trackAnalyticEventApi,
  });
};

export const useGetUserListingsAnalytics = () => {
  return useQuery<ListingAnalytics[], Error>({ // Specify return type
    queryKey: ['userListingsAnalytics'],
    queryFn: fetchUserListingsAnalyticsApi,
  });
};

export const useGetListingAnalytics = (listingId: string) => {
  return useQuery<ListingAnalytics, Error>({
    queryKey: ['listingAnalytics', listingId],
    queryFn: () => fetchListingAnalyticsApi(listingId),
    enabled: !!listingId, // Only run query if listingId is available
  });
};
