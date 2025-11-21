
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export function GoogleCallback() {
  const { googleLogin, isLoading, error, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('GoogleCallback component rendered');
    const code = new URLSearchParams(location.search).get('code');
    console.log('Authorization code:', code);

    if (code) {
      googleLogin(code);
    } else {
      toast.error('Google login failed. Please try again.');
      navigate('/signin');
    }
  }, [location, googleLogin, navigate]);

  useEffect(() => {
    if (error) {
      console.error('Google login error:', error);
      toast.error(error.message || 'An error occurred during Google login.');
      navigate('/signin');
    }
  }, [error, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      console.log('User authenticated, navigating to dashboard');
      toast.success('Welcome!');
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="mt-4 text-muted-foreground">
          Authenticating with Google...
        </p>
      </div>
    </div>
  );
}
