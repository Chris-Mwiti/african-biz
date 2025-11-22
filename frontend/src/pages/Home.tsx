import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Users,
  Building2,
  Rocket,
  Zap,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { ListingCard } from '../components/ListingCard';
import { BlogCard } from '../components/BlogCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../components/ui/carousel';
import { Card, CardContent } from '../components/ui/card';
import { useGetPublicListings } from '../services/listing.service';
import { mockBlogs } from '../lib/mockData'; // Keep mock blogs for now
import { Skeleton } from '../components/ui/skeleton';
import { Listing } from '@/lib/types';
import { SearchBar, SearchFilters } from '../components/SearchBar';

export function Home() {
  const navigate = useNavigate();
  const { data: listings, isLoading, isError } = useGetPublicListings();

  const premiumListings = listings?.data?.filter((l: Listing) => l.is_premium) || [];
  const featuredListings = listings?.data.filter((l: Listing) => !l.is_premium).slice(0, 8) || [];
  const recentBlogs = mockBlogs.slice(0, 3);

  const handleHomeSearch = (filters: SearchFilters) => {
    const queryParams = new URLSearchParams();
    if (filters.query) {
      queryParams.append('q', filters.query);
    }
    if (filters.category.length > 0) {
      queryParams.append('category', filters.category.join(','));
    }
    if (filters.country) {
      queryParams.append('country', filters.country);
    }
    if (filters.city) {
      queryParams.append('city', filters.city);
    }
    if (filters.premium !== null) {
      queryParams.append('premium', String(filters.premium));
    }
    navigate(`/find-listings?${queryParams.toString()}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center text-white overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1625989744655-9bff7a23dac4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B3D91]/98 via-[#0B3D91]/95 to-[#22C55E]/90" />
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-secondary/20 blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-accent/20 blur-3xl animate-pulse delay-1000" />
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center space-y-3">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm border border-white/20">
              <Star className="h-4 w-4 text-secondary fill-secondary" />
              <span className="text-sm font-medium text-white">
                Connecting Africans in the Diaspora
              </span>
            </div>

            <h1
              className="mb-6 text-white leading-tight"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
            >
              Your Gateway to{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                  African Excellence
                </span>
                <span className="absolute bottom-2 left-0 h-3 w-full bg-secondary/30 blur-sm" />
              </span>{' '}
              Across America
            </h1>

            <p className="mb-12 text-xl text-white/95 max-w-3xl mx-auto leading-relaxed">
              The premier directory connecting African businesses and communities
              throughout the United States. Discover authentic services, promote your
              business, and grow together.
            </p>

            {/* Search Bar */}
            <div className="mx-auto max-w-3xl">
              <SearchBar onSearch={handleHomeSearch} />
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center items-center">
              <Button
                asChild
                size="lg"
                className="gap-2 bg-secondary hover:bg-secondary/90 text-primary shadow-xl min-w-[200px]"
              >
                <Link to="/find-listings">
                  <Building2 className="h-5 w-5" />
                  Browse Businesses
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="gap-2 border-2 border-white/30 bg-white/10 text-white hover:bg-white hover:text-primary backdrop-blur-sm shadow-xl min-w-[200px]"
              >
                <Link to="/signup">
                  <Rocket className="h-5 w-5" />
                  List Your Business
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="h-8 w-5 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
            <div className="h-1.5 w-1.5 rounded-full bg-white/60" />
          </div>
        </div>
      </section>

      {/* Premium Listings */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="mb-2">Premium Listings</h2>
              <p className="text-muted-foreground">
                Discover top-rated premium businesses from our community
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/find-listings?premium=true">View All</Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
            </div>
          ) : isError ? (
            <p className="text-red-500">Failed to load premium listings.</p>
          ) : premiumListings.length > 0 ? (
            <Carousel opts={{ align: 'start', loop: true }} className="w-full">
              <CarouselContent className="-ml-4">
                {premiumListings.map((listing: Listing) => (
                  <CarouselItem key={listing.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <ListingCard listing={listing} variant="featured" />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          ) : (
            <p>No premium listings available at the moment.</p>
          )}
        </div>
      </section>

      {/* Stop Being Just Another Listing Section */}
      <section className="w-full bg-[#0B0E1A] text-white py-16 px-6 md:px-10 rounded-none">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-yellow-400 mb-4">
            Stop Being Just Another Listing
          </h2>
          <p className="text-slate-300 max-w-3xl mx-auto leading-relaxed">
            In our community, <span className="text-yellow-300 font-semibold">your success</span> is front and center.
            The African Yellow Pages is where <span className="font-semibold">connections are made</span>,
            <span className="font-semibold"> partnerships are forged</span>, and <span className="font-semibold">
            businesses grow faster, together.</span>
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-[#151A2B] p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="flex justify-center mb-3">
                <Rocket className="w-7 h-7 text-pink-400" />
              </div>
              <h3 className="font-semibold text-yellow-300 mb-2">Get Discovered First</h3>
              <p className="text-slate-400 text-sm">
                Be the top choice when customers are ready to buy.
              </p>
            </div>

            <div className="bg-[#151A2B] p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="flex justify-center mb-3">
                <Users className="w-7 h-7 text-yellow-400" />
              </div>
              <h3 className="font-semibold text-yellow-300 mb-2">Build Your Network</h3>
              <p className="text-slate-400 text-sm">
                Connect with a powerful community of partners and clients.
              </p>
            </div>

            <div className="bg-[#151A2B] p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="flex justify-center mb-3">
                <Zap className="w-7 h-7 text-orange-400" />
              </div>
              <h3 className="font-semibold text-yellow-300 mb-2">Accelerate Your Success</h3>
              <p className="text-slate-400 text-sm">
                Gain the visibility you need to thrive.
              </p>
            </div>
          </div>

          <div className="mt-10">
            <Link
              to="/pricing"
              className="inline-block bg-yellow-400 text-[#0B0E1A] font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-yellow-300 transition"
            >
              Join the Community — Upgrade to Premium Today
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="mb-2">Featured Listings</h2>
              <p className="text-muted-foreground">
                Verified businesses trusted by our community
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/find-listings">View All</Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-80 w-full" />)}
            </div>
          ) : isError ? (
            <p className="text-red-500">Failed to load featured listings.</p>
          ) : featuredListings.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredListings.map((listing: Listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <p>No featured listings available at the moment.</p>
          )}
        </div>
      </section>

      {/* Building a Community of Success */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6">
              Building a Community of Success
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Your success is our community's success. When one of us wins, we all win.
              At <span className="text-primary">African Yellow Pages USA</span>, 
              we connect you with the right audience — empowering you to build 
              meaningful partnerships, amplify visibility, and accelerate growth for all.
            </p>
            <p className="mb-12 text-lg">
              This is collaborative advantage in action. Let's create a brighter future, together.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" variant="secondary">
                <Link to="/contact">
                  Contact Us
                </Link>
              </Button>
              <Button asChild size="lg">
                <Link to="/signup">
                  List with Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Latest from the Community */}
      {recentBlogs.length > 0 && (
        <section className="bg-muted/30 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="mb-2">Latest from the Community</h2>
                <p className="text-muted-foreground">
                  Stories, tips, and insights from diaspora entrepreneurs
                </p>
              </div>
              <Button asChild variant="outline">
                <Link to="/blogs">View All</Link>
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Ready to Grow Your Business? Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="p-12 text-center">
              <h2 className="mb-4">Ready to Grow Your Business?</h2>
              <p className="mx-auto mb-8 max-w-2xl text-muted-foreground text-lg">
                Get premium visibility, post events, share your story, and connect with thousands
                of potential customers in the diaspora community.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button asChild size="lg">
                  <Link to="/signup">Create Free Listing</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/pricing">View Premium Plans</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
   </div>
  );
}
