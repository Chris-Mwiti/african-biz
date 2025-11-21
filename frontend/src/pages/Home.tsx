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

      {/* Trusted By Section */}
      <section className="border-t py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-sm text-muted-foreground uppercase tracking-wide">Trusted By</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300">
            {/* Google */}
            <div className="flex items-center">
              <svg className="h-8 w-auto" viewBox="0 0 272 92" fill="none">
                <path d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="currentColor"/>
                <path d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="currentColor"/>
                <path d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z" fill="currentColor"/>
                <path d="M224 3.14h9.88v65.32H224V3.14z" fill="currentColor"/>
                <path d="M261.1 54.01l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z" fill="currentColor"/>
                <path d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z" fill="currentColor"/>
              </svg>
            </div>

            {/* Facebook */}
            <div className="flex items-center">
              <svg className="h-8 w-auto" viewBox="0 0 48 48" fill="currentColor">
                <path d="M24 4C12.95 4 4 12.95 4 24c0 10 7.36 18.29 17 19.76V29h-5v-5h5v-3.8c0-4.94 2.94-7.68 7.45-7.68 2.16 0 4.42.39 4.42.39v4.86h-2.49c-2.45 0-3.21 1.52-3.21 3.08V24h5.46l-.87 5H26.17v14.76c9.64-1.47 17-9.76 17-19.76 0-11.05-8.95-20-20-20z"/>
              </svg>
            </div>

            {/* X (Twitter) */}
            <div className="flex items-center">
              <svg className="h-7 w-auto" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </div>

            {/* Instagram */}
            <div className="flex items-center">
              <svg className="h-8 w-auto" viewBox="0 0 48 48" fill="currentColor">
                <path d="M24 4.32c6.41 0 7.17.03 9.7.14 2.34.11 3.61.5 4.46.83 1.12.43 1.92.95 2.76 1.8.85.84 1.37 1.64 1.8 2.76.33.85.72 2.12.83 4.46.11 2.53.14 3.29.14 9.7 0 6.4-.03 7.16-.14 9.68-.11 2.34-.5 3.61-.83 4.46-.43 1.12-.95 1.92-1.8 2.76-.84.85-1.64 1.37-2.76 1.8-.85.33-2.12.72-4.46.83-2.53.11-3.29.14-9.7.14-6.41 0-7.17-.03-9.7-.14-2.34-.11-3.61-.5-4.46-.83-1.12-.43-1.92-.95-2.76-1.8-.85-.84-1.37-1.64-1.8-2.76-.33-.85-.72-2.12-.83-4.46-.11-2.52-.14-3.28-.14-9.68 0-6.41.03-7.17.14-9.7.11-2.34.5-3.61.83-4.46.43-1.12.95-1.92 1.8-2.76.84-.85 1.64-1.37 2.76-1.8.85-.33 2.12-.72 4.46-.83 2.53-.11 3.29-.14 9.7-.14M24 0c-6.52 0-7.34.03-9.9.14-2.55.12-4.3.53-5.82 1.13-1.58.61-2.92 1.43-4.25 2.76C2.7 5.36 1.88 6.7 1.27 8.28.67 9.8.26 11.55.14 14.1.03 16.66 0 17.48 0 24s.03 7.34.14 9.9c.12 2.55.53 4.3 1.13 5.82.61 1.58 1.43 2.92 2.76 4.25 1.33 1.33 2.67 2.15 4.25 2.76 1.52.6 3.27 1.01 5.82 1.13 2.56.11 3.38.14 9.9.14s7.34-.03 9.9-.14c2.55-.12 4.3-.53 5.82-1.13 1.58-.61 2.92-1.43 4.25-2.76 1.33-1.33 2.67-2.15-4.25-2.76-1.52-.6-3.27-1.01-5.82-1.13C31.34.03 30.52 0 24 0z"/>
                <path d="M24 11.67c-6.81 0-12.33 5.52-12.33 12.33S17.19 36.33 24 36.33 36.33 30.81 36.33 24 30.81 11.67 24 11.67zM24 32c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                <circle cx="36.83" cy="11.17" r="2.83"/>
              </svg>
            </div>

            {/* LinkedIn */}
            <div className="flex items-center">
              <svg className="h-8 w-auto" viewBox="0 0 48 48" fill="currentColor">
                <path d="M41.32 0H6.66C2.98 0 0 2.98 0 6.66v34.66C0 45.02 2.98 48 6.66 48h34.66c3.68 0 6.68-2.98 6.68-6.68V6.66C48 2.98 45.02 0 41.32 0zM14.23 40.97H7.11V18h7.12v22.97zM10.67 14.87c-2.28 0-4.13-1.85-4.13-4.13 0-2.28 1.85-4.13 4.13-4.13 2.28 0 4.13 1.85 4.13 4.13 0 2.28-1.84 4.13-4.13 4.13zM40.97 40.97H33.85V29.73c0-2.66-.05-6.09-3.71-6.09-3.71 0-4.28 2.9-4.28 5.9v11.43h-7.12V18h6.84v3.13h.1c.95-1.8 3.27-3.71 6.74-3.71 7.21 0 8.54 4.75 8.54 10.92v12.63z"/>
              </svg>
            </div>

            {/* Yelp */}
            <div className="flex items-center">
              <svg className="h-8 w-auto" viewBox="0 0 48 48" fill="currentColor">
                <path d="M21.87 2.52c.64-.64 1.48-.5 1.88.3l6.94 13.98c.4.8.06 1.77-.76 2.16l-8.24 3.86c-.82.39-1.77-.04-2.11-.95L14 8.96c-.34-.91.06-1.94.97-2.28l6.9-4.16zM9.93 12.87c-.23-.87.45-1.68 1.51-1.81l14.48-1.79c1.06-.13 1.97.58 2.02 1.59l.55 10.11c.05 1.01-.76 1.85-1.8 1.87l-14.43.22c-1.04.02-1.87-.77-1.86-1.76l.53-8.43zm11.18 13.65l9.4-5.42c.85-.49 1.93-.11 2.41.85l6.55 13.08c.48.96.13 2.11-.78 2.56l-10.08 5.03c-.91.45-2.01.07-2.45-.85L20 29.67c-.44-.92-.03-2.03.89-2.48l.22-.13z"/>
              </svg>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
