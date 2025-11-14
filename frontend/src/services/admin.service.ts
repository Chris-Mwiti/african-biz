import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { Listing, User, Blog, Event, Category } from '../lib/types'; // Assuming these types exist

//==================== Overview Stats ====================//
export const useGetAdminOverviewStats = () => {
    return useQuery({
        queryKey: ['admin-overview-stats'],
        queryFn: () => api.get('/admin/overview-stats').then(res => res.data),
    });
};

export const useGetRecentActivity = () => {
    return useQuery({
        queryKey: ['admin-recent-activity'],
        queryFn: () => api.get('/admin/recent-activity').then(res => res.data),
    });
};

export const useGetTopCategories = () => {
    return useQuery({
        queryKey: ['admin-top-categories'],
        queryFn: () => api.get('/admin/top-categories').then(res => res.data),
    });
};


//==================== User Management ====================//
export const useGetAdminUsers = (params: any) => {
    return useQuery({
        queryKey: ['admin-users', params],
        queryFn: () => api.get('/admin/users', { params }).then(res => res.data),
    });
};

export const useUpdateUserStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: string, status: string }) => api.put(`/admin/users/${id}/status`, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            queryClient.invalidateQueries({ queryKey: ['admin-overview-stats'] });
        },
    });
};

export const useUpdateUserRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, role }: { id: string, role: string }) => api.put(`/admin/users/${id}/role`, { role }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            queryClient.invalidateQueries({ queryKey: ['admin-overview-stats'] });
        },
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => api.delete(`/admin/users/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            queryClient.invalidateQueries({ queryKey: ['admin-overview-stats'] });
        },
    });
};

//==================== Listing Management ====================//
export const useGetAdminListings = (params: any) => {
    return useQuery({
        queryKey: ['admin-listings', params],
        queryFn: () => api.get('/admin/listings', { params }).then(res => res.data),
    });
};

export const useGetPendingListings = (params: any) => {
    return useQuery({
        queryKey: ['admin-pending-listings', params],
        queryFn: () => api.get('/admin/pending-listings', { params }).then(res => res.data),
    });
};

export const useApproveListing = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => api.put(`/admin/listings/${id}/approve`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-listings'] });
            queryClient.invalidateQueries({ queryKey: ['admin-pending-listings'] });
            queryClient.invalidateQueries({ queryKey: ['admin-overview-stats'] });
        },
    });
};

export const useRejectListing = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => api.put(`/admin/listings/${id}/reject`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-listings'] });
            queryClient.invalidateQueries({ queryKey: ['admin-pending-listings'] });
            queryClient.invalidateQueries({ queryKey: ['admin-overview-stats'] });
        },
    });
};

export const useUpdateListingStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: string, status: string }) => {
            if (status === 'ACTIVE') {
                return api.put(`/admin/listings/${id}/approve`);
            } else {
                return api.put(`/admin/listings/${id}/reject`);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-listings'] });
            queryClient.invalidateQueries({ queryKey: ['admin-pending-listings'] });
            queryClient.invalidateQueries({ queryKey: ['admin-overview-stats'] });
        },
    });
};

export const useUpgradeListingToPremium = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => api.put(`/admin/listings/${id}/upgrade`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-listings'] });
            queryClient.invalidateQueries({ queryKey: ['admin-overview-stats'] });
        },
    });
};

export const useUpdateListing = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: Partial<Listing> }) => api.put(`/admin/listings/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-listings'] });
        },
    });
};

export const useDeleteListing = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => api.delete(`/admin/listings/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-listings'] });
            queryClient.invalidateQueries({ queryKey: ['admin-overview-stats'] });
        },
    });
};

//==================== Blog Management ====================//
export const useGetAdminBlogs = (params: any) => {
    return useQuery({
        queryKey: ['admin-blogs', params],
        queryFn: () => api.get('/admin/blogs', { params }).then(res => res.data),
    });
};

//==================== Event Management ====================//
export const useGetAdminEvents = (params: any) => {
    return useQuery({
        queryKey: ['admin-events', params],
        queryFn: () => api.get('/admin/events', { params }).then(res => res.data),
    });
};

//==================== Category Management ====================//
export const useGetAdminCategories = () => {
    return useQuery({
        queryKey: ['admin-categories'],
        queryFn: () => api.get('/admin/categories').then(res => res.data),
    });
};