import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { BlogPost } from '../lib/types';
import { CreateBlogDto, UpdateBlogDto } from '../dto/blog.dto';

export const useGetBlogs = () => {
  return useQuery<BlogPost[], Error>({
    queryKey: ['blogs'],
    queryFn: async () => {
      const response = await api.get<BlogPost[]>('/blogs');
      return response.data;
    },
  });
};

export const useGetUserBlogs = () => {
  return useQuery<BlogPost[], Error>({
    queryKey: ['userBlogs'],
    queryFn: async () => {
      const response = await api.get<BlogPost[]>('/blogs/me');
      return response.data;
    },
  });
};

export const useGetBlog = (id: string) => {
  return useQuery<BlogPost, Error>({
    queryKey: ['blog', id],
    queryFn: async () => {
      const response = await api.get<BlogPost>(`/blogs/${id}`);
      return response.data;
    },
  });
};

export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation<BlogPost, Error, CreateBlogDto>({
    mutationFn: async (newBlog: CreateBlogDto) => {
      const response = await api.post<BlogPost>('/blogs', newBlog);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });
};

export const useUpdateBlog = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation<BlogPost, Error, UpdateBlogDto>({
    mutationFn: async (updatedBlog: UpdateBlogDto) => {
      const response = await api.patch<BlogPost>(`/blogs/${id}`, updatedBlog);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blog', id] });
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (blogId: string) => {
      await api.delete(`/blogs/${blogId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['userBlogs'] });
    },
  });
};