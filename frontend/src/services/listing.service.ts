import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api'; // Import the axios instance
import { Listing, PaginatedResponse } from '../lib/types';
import { CreateListingDto, UpdateListingDto } from '../dto/listing.dto';


export const useGetPublicListings = (page = 1, pageSize = 10, categoryId?: string, query?: string) => {
  return useQuery<PaginatedResponse<Listing>, Error>({
    queryKey: ['public-listings', page, pageSize, categoryId, query],
    queryFn: async () => {
      const params: { page: number; pageSize: number; categoryId?: string; q?: string } = { page, pageSize };
      if (categoryId) {
        params.categoryId = categoryId;
      }
      if (query) {
        params.q = query;
      }
      const response = await api.get<PaginatedResponse<Listing>>('/listings/public', { params }); // Use api.get with params
      return response.data;
    },
  });
};

export const useGetMyListings = () => {
  return useQuery<Listing[], Error>({
    queryKey: ['my-listings'],
    queryFn: async () => {
      const response = await api.get<Listing[]>('/listings'); // Use api.get
      return response.data;
    },
  });
};

export const useGetListing = (id: string) => {
  return useQuery<Listing, Error>({
    queryKey: ['listing', id],
    queryFn: async () => {
      const response = await api.get<Listing>(`/listings/${id}`); // Use api.get
      return response.data;
    },
  });
};

export const useCreateListing = () => {
  const queryClient = useQueryClient();
  return useMutation<Listing, Error, CreateListingDto>({
    mutationFn: async (newListing: CreateListingDto) => {
      const response = await api.post<Listing>('/listings', newListing); // Use api.post
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['public-listings'] });
      queryClient.invalidateQueries({ queryKey: ['my-listings'] });
    },
  });
};

export const useUpdateListing = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation<Listing, Error, UpdateListingDto>({
    mutationFn: async (updatedListing: UpdateListingDto) => {
      const response = await api.patch<Listing>(`/listings/${id}`, updatedListing); // Use api.patch
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['public-listings'] });
      queryClient.invalidateQueries({ queryKey: ['my-listings'] });
      queryClient.invalidateQueries({ queryKey: ['listing', id] });
    },
  });
};

export const useSearchListings = (query: string) => {
  return useQuery<Listing[], Error>({
    queryKey: ['search-listings', query],
    queryFn: async () => {
      const response = await api.get<Listing[]>(`/listings/search?q=${query}`);
      return response.data;
    },
    enabled: !!query, // Only run query if query is not empty
  });
};
