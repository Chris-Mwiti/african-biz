import { Link } from 'react-router-dom';
import {
  Eye,
  MousePointerClick,
  Mail,
  TrendingUp,
  Crown,
  Calendar,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ListingCard } from '../../components/ListingCard';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/dto/auth.dto';
import { useGetUserListingsAnalytics } from '../../services/analytic.service';
import { useGetMyListings } from '../../services/listing.service';

export function DashboardOverview() {
  const { user } = useAuth();
  const { data: myAnalytics, isLoading: analyticsLoading, isError: analyticsError } = useGetUserListingsAnalytics();
  const { data: myListings, isLoading: listingsLoading, isError: listingsError } = useGetMyListings();

  if (!user) {
    return (
      <p className='text-xl text-red'>
        You are not logged in
      </p>
    );
  }

  if (analyticsLoading || listingsLoading) return <div>Loading dashboard...</div>;
  if (analyticsError) return <div>Error loading analytics: {analyticsError.message}</div>;
  if (listingsError) return <div>Error loading listings: {listingsError.message}</div>;

  const isPremium = user.role === Role.PREMIUM;

  const totalViews = myAnalytics?.reduce((sum, item) => sum + item.views, 0) || 0;
  const totalClicks = myAnalytics?.reduce((sum, item) => sum + item.clicks, 0) || 0;
  const totalContacts = myAnalytics?.reduce((sum, item) => sum + item.contacts, 0) || 0;

  const activeListingsCount = myListings?.length || 0;
  const premiumListingsCount = myListings?.filter((l) => l.is_premium).length || 0;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="border-b bg-muted/30 px-6 py-8 -mx-6 -mt-6 mb-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="mb-2">Welcome back, {user.name}!</h1>
              <p className="text-muted-foreground">
                Here's what's happening with your listings
              </p>
            </div>
            {!isPremium && (
              <Button asChild>
                <Link to="/pricing">
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade to Premium
                </Link>
              </Button>
            )}
          </div>

          {isPremium && (
            <Badge className="bg-secondary text-secondary-foreground">
              <Crown className="mr-1 h-3 w-3" />
              Premium Member
            </Badge>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl p-6">
        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="mr-1 inline h-3 w-3 text-accent" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Clicks</CardTitle>
              <MousePointerClick className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="mr-1 inline h-3 w-3 text-accent" />
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Contact Requests</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalContacts.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="mr-1 inline h-3 w-3 text-accent" />
                +15% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeListingsCount}</div>
              <p className="text-xs text-muted-foreground">
                {premiumListingsCount} premium
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Create New Listing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Add a new business to your portfolio
              </p>
              <Button asChild className="w-full">
                <Link to="/dashboard/new-listing">
                  Create Listing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {isPremium && (
            <>
              <Card className="border-secondary/20 bg-gradient-to-br from-secondary/5 to-secondary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Post an Event
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Promote your upcoming events
                  </p>
                  <Button asChild variant="secondary" className="w-full">
                    <Link to="/dashboard/create-event">
                      Create Event
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Write a Blog Post
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Share your story and insights
                  </p>
                  <Button asChild className="w-full bg-accent hover:bg-accent/90">
                    <Link to="/dashboard/blogs/new">
                      Create Blog
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {!isPremium && (
          <Card className="mb-8 border-secondary/50 bg-gradient-to-br from-secondary/10 to-secondary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="mb-2 flex items-center gap-2">
                    <Crown className="h-5 w-5 text-secondary" />
                    Unlock Premium Features
                  </h3>
                  <p className="mb-4 text-muted-foreground">
                    Get featured on the home page, post events & blogs, and access detailed analytics
                  </p>
                  <ul className="mb-4 space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                      Featured on home page carousel
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                      Create unlimited events and blog posts
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                      Advanced analytics and insights
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                      Priority search ranking
                    </li>
                  </ul>
                  <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90">
                    <Link to="/pricing">
                      Upgrade to Premium
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* My Listings */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2>My Listings</h2>
            <Button asChild variant="outline">
              <Link to="/dashboard/listings">View All</Link>
            </Button>
          </div>

          {myListings && myListings.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {myListings.slice(0, 3).map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex min-h-[200px] flex-col items-center justify-center p-8 text-center">
                <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2">No listings yet</h3>
                <p className="mb-4 text-muted-foreground">
                  Create your first business listing to get started
                </p>
                <Button asChild>
                  <Link to="/dashboard/new-listing">Create Listing</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
