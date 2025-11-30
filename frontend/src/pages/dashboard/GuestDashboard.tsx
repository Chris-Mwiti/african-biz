import { Rocket, Gem, Crown } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

const features = [
  {
    icon: <Rocket className="h-10 w-10 text-primary" />,
    title: 'Get Your Business Seen',
    description: 'Create a listing for your business and reach thousands of potential customers.',
    cta: 'Create a Listing',
    link: ROUTES.SIGNUP,
  },
  {
    icon: <Gem className="h-10 w-10 text-primary" />,
    title: 'Unlock Premium Features',
    description: 'Upgrade to a premium account to unlock exclusive features like analytics, events, and more.',
    cta: 'Upgrade to Premium',
    link: ROUTES.PRICING,
  },
  {
    icon: <Crown className="h-10 w-10 text-primary" />,
    title: 'Join the Community',
    description: 'Become a member of our community and connect with other business owners in Africa.',
    cta: 'Join Now',
    link: ROUTES.SIGNUP,
  },
];

const GuestDashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-3 animate-fade-in-down">
          Welcome to African Yellow Pages
        </h1>
        <p className="text-xl text-gray-500 animate-fade-in-up">
          Your guide to discovering businesses and services across the continent.
        </p>
      </div>

      <div className="w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="transform hover:scale-105 transition-transform duration-300 ease-in-out"
            >
              <CardHeader className="items-center">
                {feature.icon}
                <CardTitle className="text-2xl font-semibold mt-4">{feature.title}</CardTitle>
                <CardDescription className="text-center mt-2">{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to={feature.link}>{feature.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-16 text-center">
        <p className="text-gray-600 mb-4">Ready to explore?</p>
        <Button asChild size="lg">
          <Link to={ROUTES.FIND_LISTINGS}>Browse Listings</Link>
        </Button>
      </div>
    </div>
  );
};

export default GuestDashboard;
