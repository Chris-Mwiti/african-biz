import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api'; // Import the axios instance

// Define a type for Category, matching your Prisma schema
interface Category {
  id: string;
  name: string;
}

// DTOs for frontend (can be simpler than backend DTOs if not all fields are needed)
interface CreateCategoryDto {
  name: string;
}

interface UpdateCategoryDto {
  name: string;
}

// --- API Calls ---

const fetchCategories = async (): Promise<Category[]> => {
  const response = await api.get<Category[]>('/categories'); // Use api.get
  return response.data;
};

const createCategoryApi = async (newCategory: CreateCategoryDto): Promise<Category> => {
  const response = await api.post<Category>('/categories', newCategory); // Use api.post
  return response.data;
};

const updateCategoryApi = async ({ id, name }: { id: string } & UpdateCategoryDto): Promise<Category> => {
  const response = await api.put<Category>(`/categories/${id}`, { name }); // Use api.put
  return response.data;
};

const deleteCategoryApi = async (id: string): Promise<void> => {
  await api.delete<void>(`/categories/${id}`); // Use api.delete
};

// --- React Query Hooks ---

export const useGetCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<Category, Error, CreateCategoryDto>({
    mutationFn: createCategoryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<Category, Error, { id: string } & UpdateCategoryDto>({
    mutationFn: updateCategoryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteCategoryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};
