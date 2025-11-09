import { useState, useMemo } from 'react';
import { TrendingUp, Eye, MousePointerClick, Mail, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import { useGetUserListingsAnalytics, useGetListingAnalytics } from '../../services/analytic.service';
import { Role } from '../../dto/auth.dto';

export function Analytics() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const [selectedListingId, setSelectedListingId] = useState<string>('all');

  const { user } = useAuth();
  const isPremium = user?.role === Role.PREMIUM;

  const {
    data: allListingsAnalytics,
    isLoading: isLoadingAllAnalytics,
    isError: isErrorAllAnalytics,
  } = useGetUserListingsAnalytics();

  const {
    data: singleListingAnalytics,
    isLoading: isLoadingSingleAnalytics,
    isError: isErrorSingleAnalytics,
  } = useGetListingAnalytics(selectedListingId !== 'all' ? selectedListingId : '');

  const currentAnalytics = useMemo(() => {
    if (selectedListingId === 'all') {
      return allListingsAnalytics?.reduce(
        (acc, curr) => ({
          listingId: 'all',
          listingTitle: 'All Listings',
          views: acc.views + curr.views,
          clicks: acc.clicks + curr.clicks,
          contacts: acc.contacts + curr.contacts,
          eventsCount: acc.eventsCount + curr.eventsCount,
        }),
        { listingId: 'all', listingTitle: 'All Listings', views: 0, clicks: 0, contacts: 0, eventsCount: 0 }
      );
    }
    return singleListingAnalytics;
  }, [selectedListingId, allListingsAnalytics, singleListingAnalytics]);

  const myListings = useMemo(() => {
    return allListingsAnalytics?.map(item => ({ id: item.listingId, title: item.listingTitle })) || [];
  }, [allListingsAnalytics]);

  if (!isPremium) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <Card className="max-w-md text-center">
          <CardContent className="p-8">
            <TrendingUp className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2">Premium Feature</h3>
            <p className="mb-6 text-muted-foreground">
              Advanced analytics are only available for Premium members. Upgrade to unlock detailed insights.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoadingAllAnalytics || isLoadingSingleAnalytics) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (isErrorAllAnalytics || isErrorSingleAnalytics || !currentAnalytics) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <p>Error loading analytics.</p>
      </div>
    );
  }

  // Placeholder for chart data - backend currently only provides total counts
  // For actual charts, the backend would need to provide time-series data
  const mockChartData = [
    { date: '2023-10-26', views: 10, clicks: 2, contacts: 1 },
    { date: '2023-10-27', views: 15, clicks: 3, contacts: 1 },
    { date: '2023-10-28', views: 20, clicks: 5, contacts: 2 },
    { date: '2023-10-29', views: 12, clicks: 3, contacts: 0 },
    { date: '2023-10-30', views: 18, clicks: 4, contacts: 1 },
    { date: '2023-10-31', views: 25, clicks: 6, contacts: 2 },
    { date: '2023-11-01', views: 30, clicks: 8, contacts: 3 },
  ];

  //@todo: Improve the error handling for this section
  const totalViews = currentAnalytics.views || 0;
  const totalClicks = currentAnalytics.clicks || 0;
  const totalContacts = currentAnalytics.contacts || 0;
  const totalEvents = currentAnalytics.eventsCount || 0;
  const conversionRate = totalClicks > 0 ? ((totalContacts / totalClicks) * 100).toFixed(1) : '0.0';
  

  //debugging purpose
  console.log("total events: ", totalEvents)

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="border-b bg-muted/30 px-6 py-8 -mx-6 -mt-6 mb-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-2">Analytics</h1>
          <p className="text-muted-foreground">
            Track your listing performance and engagement
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          <Select value={selectedListingId} onValueChange={setSelectedListingId}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select listing" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Listings</SelectItem>
              {myListings.map((listing) => (
                <SelectItem key={listing.id} value={listing.id}>
                  {listing.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

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
                {/* <TrendingUp className="mr-1 inline h-3 w-3 text-accent" /> */}
                {/* +12% from previous period */}
                Total views for {currentAnalytics.listingTitle}
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
                {/* <TrendingUp className="mr-1 inline h-3 w-3 text-accent" /> */}
                {/* +8% from previous period */}
                Total clicks for {currentAnalytics.listingTitle}
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
                {/* <TrendingUp className="mr-1 inline h-3 w-3 text-accent" /> */}
                {/* +15% from previous period */}
                Total contacts for {currentAnalytics.listingTitle}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEvents.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Total events created for {currentAnalytics.listingTitle}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                Clicks to contacts ratio
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts - Using mock data for now as backend only provides total counts */}
        <Tabs defaultValue="views" className="space-y-6">
          <TabsList>
            <TabsTrigger value="views">Views</TabsTrigger>
            <TabsTrigger value="clicks">Clicks</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
          </TabsList>

          <TabsContent value="views" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Views Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="views" stroke="#0B3D91" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clicks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Clicks Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="clicks" fill="#F9A826" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Contact Requests Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="contacts" stroke="#22C55E" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
