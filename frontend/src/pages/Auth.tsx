import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, User, Globe, CheckCircle2, Shield, Zap } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form';
import { toast } from 'sonner';
import { COUNTRIES } from '../lib/mockData';
import { useAuth } from '../contexts/AuthContext';
import { SignUpSchema, SignInSchema, SignUpDto, SignInDto } from '../dto/auth.dto';

interface AuthProps {
  mode: 'signin' | 'signup';
}

export function Auth({ mode }: AuthProps) {
  const { login, signup, isLoading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const form = useForm<SignUpDto | SignInDto>({
    resolver: zodResolver(mode === 'signup' ? SignUpSchema : SignInSchema),
    defaultValues: {
      email: '',
      password: '',
      ...(mode === 'signup' && { name: '', country_of_residence: '' }),
    },
  });

  useEffect(() => {
    if (error) {
      toast.error(error.message || 'An error occurred. Please try again.');
    }
  }, [error]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: SignUpDto | SignInDto) => {
    try {
      if (mode === 'signup') {
        await signup(data as SignUpDto);
        toast.success('Welcome to African Yellow Pages USA! 🎉 Please sign in.');
        navigate('/signin');
      } else {
        await login(data as SignInDto);
        toast.success('Welcome back! 👋');
        navigate('/dashboard');
      }
    } catch (err) {
      // Error is handled by the useEffect hook
    }
  };

  const handleGoogleLogin = () => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;

    if (!googleClientId || !redirectUri) {
      toast.error('Google login is not configured. Please contact support.');
      return;
    }

    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const options = {
      redirect_uri: redirectUri,
      client_id: googleClientId,
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ].join(' '),
    };

    const qs = new URLSearchParams(options);
    window.location.href = `${rootUrl}?${qs.toString()}`;
  };

  const handleSocialLogin = (provider: string) => {
    if (provider === 'Google') {
      toast.info(`${provider} login coming soon!`);
    } else {
      toast.info(`${provider} login coming soon!`);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/95 to-accent relative overflow-hidden">
         <div
          className="absolute inset-0 opacity-10 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1734255026082-82fdc81991f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080)",
          }}
        />
        <div className="relative z-10 flex flex-col justify-center px-12 py-12 text-white">
          <h1 className="mb-4 text-white">African Yellow Pages USA</h1>
          <p className="text-lg text-white/90 mb-8">
            Your gateway to African businesses across America
          </p>

          <div className="space-y-6">
            {[
              {
                icon: CheckCircle2,
                title: "Connect with Your Community",
                text: "Join thousands of African entrepreneurs and businesses across the USA",
              },
              {
                icon: Zap,
                title: "Grow Your Business",
                text: "Get discovered by customers actively searching for your services",
              },
              {
                icon: Shield,
                title: "Verified & Trusted",
                text: "Build trust with verified badges and authentic reviews",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="mb-1 text-white">{item.title}</h3>
                  <p className="text-white/80">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-sm text-white/70">
              "This platform has transformed how we connect with our community. Our business has grown
              300% since joining!"
            </p>
            <p className="mt-2 text-white">— FM, Developer</p>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex w-full items-center justify-center bg-background px-4 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:hidden">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
              <span className="text-xl text-white font-bold">AYP</span>
            </div>
            <h2 className="font-semibold text-xl">African Yellow Pages USA</h2>
          </div>

          <Card className="border-2">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl">
                {mode === "signup" ? "Create your account" : "Welcome back"}
              </CardTitle>
              <CardDescription className="text-base">
                {mode === "signup"
                  ? "Start growing your business today"
                  : "Sign in to manage your listings"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {mode === 'signup' && (
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <Input placeholder="Your full name" {...field} className="pl-10 h-11" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input type="email" placeholder="you@example.com" {...field} className="pl-10 h-11" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input type="password" placeholder="••••••••" {...field} className="pl-10 h-11" />
                          </div>
                        </FormControl>
                        {mode === 'signup' && (
                          <p className="text-xs text-muted-foreground">
                            Must be at least 8 characters
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {mode === 'signup' && (
                    <FormField
                      control={form.control}
                      name="country_of_residence"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country of Residence *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <div className="relative">
                                <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
                                <SelectTrigger className="pl-10 h-11">
                                  <SelectValue placeholder="Select your country" />
                                </SelectTrigger>
                              </div>
                            </FormControl>
                            <SelectContent>
                              {COUNTRIES.map((country) => (
                                <SelectItem key={country} value={country}>
                                  {country}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {mode === 'signin' && (
                    <div className="flex items-center justify-end">
                      <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                  )}

                  <Button type="submit" className="w-full h-11" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Loading...
                      </span>
                    ) : mode === 'signup' ? (
                      'Create Account'
                    ) : (
                      'Sign In'
                    )}
                  </Button>

                  {mode === 'signup' && (
                    <p className="text-xs text-center text-muted-foreground">
                      By signing up, you agree to our{" "}
                      <Link to="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                      .
                    </p>
                  )}
                </form>
              </Form>

              <div className="relative">
                <Separator />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2">
                  <span className="text-xs text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialLogin('Google')}
                  className="h-11"
                >
                  <img
                    src="https://www.svgrepo.com/show/355037/google.svg"
                    alt="Google"
                    className="h-5 w-5 mr-2"
                  />
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialLogin('Facebook')}
                  className="h-11"
                >
                  <img
                    src="https://www.svgrepo.com/show/448224/facebook.svg"
                    alt="Facebook"
                    className="h-5 w-5 mr-2"
                  />
                  Facebook
                </Button>
              </div>

              <div className="text-center">
                {mode === 'signup' ? (
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link to="/signin" className="text-primary hover:underline">
                      Sign in
                    </Link>
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Don’t have an account?{" "}
                    <Link to="/signup" className="text-primary hover:underline">
                      Sign up for free
                    </Link>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {mode === 'signup' && (
            <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-4 text-center">
              <h3 className="text-base font-semibold text-primary mb-1">
                🚀 Start Your Journey With Confidence
              </h3>
              <p className="text-sm text-muted-foreground">
                Create your profile today and join a growing network of verified African-owned businesses
                across the United States. Build visibility, trust, and growth — all in one place.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
