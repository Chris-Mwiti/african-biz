import { useState, useEffect } from 'react';
import { Grid, List } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { SearchBar, SearchFilters } from '../components/SearchBar';
import { ListingCard } from '../components/ListingCard';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useGetPublicListings } from '../services/listing.service';
import { useGetCategories } from '../services/category.service';
import { Listing } from '../lib/types';

export function FindListings() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [page, setPage] = useState(1);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const selectedCategoryId = searchParams.get('category');

  const { data, isLoading, error } = useGetPublicListings(page, 12, selectedCategoryId || undefined);
  const { data: categories, isLoading: isLoadingCategories, isError: isErrorCategories } = useGetCategories();

  const listings = data?.data || [];
  const meta = data?.meta;

  const handleSortChange = (value: string) => {
    setSortBy(value);
    // TODO: Implement server-side sorting
  };

  const handleFindListingsSearch = (filters: SearchFilters) => {
    const newSearchParams = new URLSearchParams();
    if (filters.query) {
      newSearchParams.set('q', filters.query);
    }
    if (filters.category.length > 0) {
      newSearchParams.set('category', filters.category.join(','));
    }
    if (filters.country) {
      newSearchParams.set('country', filters.country);
    }
    if (filters.city) {
      newSearchParams.set('city', filters.city);
    }
    if (filters.premium !== null) {
      newSearchParams.set('premium', String(filters.premium));
    }
    setSearchParams(newSearchParams);
    setPage(1); // Reset to first page on new search
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2">Find Listings</h1>
          <p className="text-muted-foreground">
            Discover African businesses in the diaspora
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar onSearch={handleFindListingsSearch} showFilters={true} />
        </div>

        {/* Browse by Category Section */}
        <div className="mb-12">
          <div className="mb-6">
            <h3 className="mb-2">Browse by Category</h3>
            <p className="text-muted-foreground">
              Find businesses in your area of interest
            </p>
          </div>

          {isLoadingCategories && <p>Loading categories...</p>}
          {isErrorCategories && <p className="text-red-500 text-sm">Error loading categories.</p>}

       </div>

        {/* Results Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-muted-foreground">
              Showing <span className="font-medium text-foreground">{listings.length}</span> of {" "}
              <span className="font-medium text-foreground">{meta?.total || 0}</span> results
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="views">Most Viewed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 rounded-lg border p-1">
              <Button
                variant={view === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setView('grid')}
                className="h-8 w-8 p-0"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={view === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setView('list')}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Listings Grid/List */}
        {isLoading ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center">
            <p>Loading...</p>
          </div>
        ) : error ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center">
            <p>Error fetching listings.</p>
          </div>
        ) : listings.length > 0 ? (
          <div>
            <div
              className={
                view === 'grid'
                  ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3'
                  : 'space-y-4'
              }
            >
              {listings.map((listing: Listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  variant={view === 'list' ? 'compact' : 'default'}
                />
              ))}
            </div>
            <div className="mt-8 flex justify-center gap-4">
              <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
                Previous
              </Button>
              <Button onClick={() => setPage(page + 1)} disabled={page === meta?.totalPages}>
                Next
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed">
            <p className="mb-2 text-muted-foreground">No listings found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
