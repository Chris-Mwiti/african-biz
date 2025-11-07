import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LoginDto, SignUpDto } from '@/lib/types';
import { STORAGE_KEYS } from '@/constants/auth';
import { ROUTES } from '@/constants/routes';
import { useLogin, useRegister, useGetMe } from '@/services/auth.service';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  login: (credentials: LoginDto) => Promise<void>;
  logout: () => void;
  signup: (userData: SignUpDto) => Promise<void>;
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
  const { data: meData, isLoading: meIsLoading, isError: meIsError, error: meError } = useGetMe();

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      if (meData) {
        setUser(meData);
        setIsAuthenticated(true);
      }
      setIsLoading(meIsLoading);
      setIsError(meIsError);
      setError(meError);
    } else {
      setIsLoading(false);
    }
  }, [meData, meIsLoading, meIsError, meError]);

  const login = async (credentials: LoginDto) => {
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
  };

  const signup = async (userData: SignUpDto) => {
    try {
      await registerMutation.mutateAsync(userData);
      navigate(ROUTES.SIGNIN);
    } catch (err) {
      setError(err as Error);
      setIsError(true);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    navigate(ROUTES.HOME);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, signup, isLoading, isError, error }}>
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
