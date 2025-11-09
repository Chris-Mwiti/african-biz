import { useMutation, useQuery } from '@tanstack/react-query';
import { SignInDto, SignUpDto, UserDto } from '@/dto/auth.dto';
import api from '@/api';

export const useLogin = () => {
  return useMutation({ 
    mutationFn: async (credentials: SignInDto) => {
      const { data } = await api.post('/auth/login', credentials);
      return data;
    }
  });
};

export const useRegister = () => {
  return useMutation({ 
    mutationFn: async (userData: SignUpDto) => {
      const { data } = await api.post('/auth/signup', userData);
      return data;
    }
  });
};

export const useGetMe = () => {
  return useQuery<UserDto, Error>({
    queryKey: ['me'],
    queryFn: async () => {
      const { data } = await api.get('/auth/me');
      return data;
    },
  });
};

export const useUpdatePassword = () => {
  return useMutation({ 
    mutationFn: async (password: string) => {
      const { data } = await api.put('/auth/password', { password });
      return data;
    }
  });
};

export const useDeleteMe = () => {
  return useMutation({ 
    mutationFn: async () => {
      const { data } = await api.delete('/auth/me');
      return data;
    }
  });
};
