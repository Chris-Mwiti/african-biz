import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
    import api from '../api';
    import {
      AdminOverviewStats,
      RecentActivity,
      TopCategory,
      AdminUser,
      AdminListing,
      UserStatus,
    } from '../lib/types';
    import { UpdateUserStatusDto, UpdateUserRoleDto } from '../dto/user.dto';

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
    export const useGetAdminUsers = (params?: { search?: string; role?: string; status?: UserStatus; page?: number; pageSize?: number }) => {
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
