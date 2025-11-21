import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LoginDto, SignUpDto } from '@/lib/types';
import { STORAGE_KEYS } from '@/constants/auth';
import { ROUTES } from '@/constants/routes';
import { useLogin, useRegister, useGetMe, useGoogleLogin } from '@/services/auth.service';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  login: (credentials: LoginDto) => Promise<void>;
  logout: () => void;
  signup: (userData: SignUpDto) => Promise<void>;
  googleLogin: (code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const googleLoginMutation = useGoogleLogin();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { data: meData, isLoading: meIsLoading, isError: meIsError, error: meError, isSuccess: meIsSuccess } = useGetMe();

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token && isInitialLoad) {
      if (meIsSuccess && meData) {
        setUser(meData);
        setIsAuthenticated(true);
        setIsInitialLoad(false);
      }
      setIsLoading(meIsLoading);
      setIsError(meIsError);
      setError(meError);
    } else {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  }, [meIsSuccess, meIsLoading, meIsError, meError, meData, isInitialLoad]);

  const login = useCallback(async (credentials: LoginDto) => {
    try {
      const { token, user } = await loginMutation.mutateAsync(credentials);
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      setUser(user);
      setIsAuthenticated(true);
      if (user.role === 'ADMIN') {
        navigate(ROUTES.ADMIN);
      } else {
        navigate(ROUTES.DASHBOARD);
      }
    } catch (err) {
      setError(err as Error);
      setIsError(true);
    }
  }, [loginMutation, navigate]);

  const googleLogin = useCallback(async (code: string) => {
    try {
      const { token, user } = await googleLoginMutation.mutateAsync(code);
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      setUser(user);
      setIsAuthenticated(true);
      if (user.role === 'ADMIN') {
        navigate(ROUTES.ADMIN);
      } else {
        navigate(ROUTES.DASHBOARD);
      }
    } catch (err) {
      setError(err as Error);
      setIsError(true);
    }
  }, [googleLoginMutation, navigate]);

  const signup = useCallback(async (userData: SignUpDto) => {
    try {
      await registerMutation.mutateAsync(userData);
      navigate(ROUTES.SIGNIN);
    } catch (err) {
      setError(err as Error);
      setIsError(true);
    }
  }, [registerMutation, navigate]);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    navigate(ROUTES.HOME);
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, signup, googleLogin, isLoading, isError, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
