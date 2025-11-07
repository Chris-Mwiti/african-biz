import { Link } from 'react-router-dom';
import {
  Users,
  Building2,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Calendar,
  FileText,
  AlertTriangle,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { useGetAdminOverviewStats, useGetRecentActivity, useGetTopCategories } from '../../services/admin.service';
import { format } from 'date-fns';

export function AdminOverview() {
  const { data: overviewStats, isLoading: statsLoading, isError: statsError } = useGetAdminOverviewStats();
  const { data: recentActivity, isLoading: activityLoading, isError: activityError } = useGetRecentActivity();
  const { data: topCategories, isLoading: categoriesLoading, isError: categoriesError } = useGetTopCategories();

  if (statsLoading || activityLoading || categoriesLoading) return <div>Loading admin overview...</div>;
  if (statsError) return <div>Error loading stats: {statsError.message}</div>;
  if (activityError) return <div>Error loading activity: {activityError.message}</div>;
  if (categoriesError) return <div>Error loading categories: {categoriesError.message}</div>;

  const totalListings = overviewStats?.totalListings || 0;
  const pendingListings = overviewStats?.pendingListings || 0;
  const premiumListings = overviewStats?.premiumListings || 0;
  const verifiedListings = overviewStats?.verifiedListings || 0;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with African Yellow Pages USA
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Total Listings</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{overviewStats?.totalListings || 0}</div>
              <div className="mt-2 flex items-center gap-2">
                <Progress value={(overviewStats?.totalListings / 1000) * 100} className="h-2" /> {/* Assuming 1000 is max capacity for progress bar */}
                <span className="text-xs text-muted-foreground">{(overviewStats?.totalListings / 1000 * 100).toFixed(0)}% capacity</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                <TrendingUp className="mr-1 inline h-3 w-3 text-accent" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{overviewStats?.totalUsers || 0}</div>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="secondary">+43 this week</Badge>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                <TrendingUp className="mr-1 inline h-3 w-3 text-accent" />
                +18% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">${overviewStats?.monthlyRevenue.toLocaleString() || 0}</div>
              <div className="mt-2">
                <Badge className="bg-accent">Premium: {overviewStats?.premiumListings || 0}</Badge>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                <TrendingUp className="mr-1 inline h-3 w-3 text-accent" />
                +22% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Pending Approvals</CardTitle>
              <AlertTriangle className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{overviewStats?.pendingListings || 0}</div>
              <div className="mt-2">
                <Button asChild variant="secondary" size="sm" className="w-full">
                  <Link to="/admin/pending">
                    Review Now
                    <ArrowRight className="ml-2 h-3 w-3" />
                  </Link>
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Requires immediate attention
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/admin/pending">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Review Pending Approvals ({overviewStats?.pendingListings || 0})
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/admin/users">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/admin/events">
                  <Calendar className="mr-2 h-4 w-4" />
                  Manage Events ({overviewStats?.totalEvents || 0}) {/* Assuming totalEvents will be part of overviewStats */}
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/admin/blogs">
                  <FileText className="mr-2 h-4 w-4" />
                  Manage Blog Posts ({overviewStats?.totalBlogs || 0}) {/* Assuming totalBlogs will be part of overviewStats */}
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity?.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 border-b pb-4 last:border-0 last:pb-0">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={activity.user_image} /> {/* Assuming user_image will be part of RecentActivity */}
                      <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="text-primary">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground">{format(new Date(activity.timestamp), 'PPP p')}</p>
                    </div>
                    <Badge variant="outline" className="flex-shrink-0">
                      {activity.type}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button asChild variant="link" className="mt-4 w-full">
                <Link to="/admin/activity">
                  View All Activity
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Platform Health */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Verified Listings</span>
                  <span>{verifiedListings}/{totalListings}</span>
                </div>
                <Progress value={(verifiedListings / totalListings) * 100} />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Premium Conversion</span>
                  <span>{Math.round((premiumListings / totalListings) * 100) || 0}%</span>
                </div>
                <Progress value={(premiumListings / totalListings) * 100 || 0} />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">User Engagement</span>
                  <span>78%</span> {/* Placeholder for now */}
                </div>
                <Progress value={78} /> {/* Placeholder for now */}
              </div>
            </CardContent>
          </Card>

          {/* Top Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Top Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topCategories?.map((category) => (
                  <div key={category.id} className="flex items-center justify-between">
                    <span className="text-sm">{category.name}</span>
                    <Badge variant="secondary">{category.listingCount} listings</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
