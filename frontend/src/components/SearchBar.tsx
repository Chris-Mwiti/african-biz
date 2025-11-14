import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { Badge } from './ui/badge';
import { CATEGORIES, COUNTRIES } from '../lib/mockData';
import { useSearchListings } from '../services/listing.service';
import { Link } from 'react-router-dom';

interface SearchBarProps {
  onSearch?: (filters: SearchFilters) => void;
  showFilters?: boolean;
}

export interface SearchFilters {
  query: string;
  category: string[];
  country: string;
  city: string;
  premium: boolean | null;
}

export function SearchBar({ onSearch, showFilters = true }: SearchBarProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: [],
    country: '',
    city: '',
    premium: null,
  });
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { data: searchResults, isLoading: isLoadingSearch, isError: isErrorSearch, refetch } = useSearchListings(filters.query);

  const handleSearch = () => {
    if (filters.query.length > 2) {
      refetch();
    } else {
      // Optionally, clear previous search results if query is too short
      // setSearchResults([]);
    }
    onSearch?.(filters); // Still call onSearch for external filter handling
  };

  const toggleCategory = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category.includes(category)
        ? prev.category.filter((c) => c !== category)
        : [...prev.category, category],
    }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      category: [],
      country: '',
      city: '',
      premium: null,
    });
  };

  const activeFiltersCount =
    filters.category.length +
    (filters.country ? 1 : 0) +
    (filters.city ? 1 : 0) +
    (filters.premium !== null ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search business, category or country"
            value={filters.query}
            onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="h-12 pl-10 pr-4 text-foreground"
          />
          {filters.query.length > 2 && (
            <div className="absolute left-0 right-0 top-14 z-10 rounded-md border bg-popover p-2 text-popover-foreground shadow-md">
              {isLoadingSearch && <div className="p-2 text-sm">Searching...</div>}
              {isErrorSearch && <div className="p-2 text-sm text-destructive">Error searching.</div>}
              {!isLoadingSearch && !isErrorSearch && searchResults && searchResults.length > 0 ? (
                searchResults.map((listing) => (
                  <Link
                    key={listing.id}
                    to={`/listing/${listing.id}`}
                    className="block p-2 hover:bg-muted rounded-sm"
                    onClick={() => setFilters((prev) => ({ ...prev, query: '' }))}
                  >
                    {listing.title}
                  </Link>
                ))
              ) : (!isLoadingSearch && !isErrorSearch && filters.query.length > 2 && (
                <div className="p-2 text-sm text-muted-foreground">No results found.</div>
              ))}
            </div>
          )}
        </div>
        <Button onClick={handleSearch} className="h-12 px-6">
          Search
        </Button>
        {showFilters && (
          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="h-12 px-4">
                <Filter className="h-5 w-5" />
                <span className="ml-2 hidden sm:inline">Filters</span>
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full overflow-y-auto sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Filter Listings</SheetTitle>
                <SheetDescription>
                  Refine your search with advanced filters
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Categories */}
                <div className="space-y-2">
                  <Label>Categories</Label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((category) => (
                      <Badge
                        key={category}
                        variant={
                          filters.category.includes(category) ? 'default' : 'outline'
                        }
                        className="cursor-pointer"
                        onClick={() => toggleCategory(category)}
                      >
                        {category}
                        {filters.category.includes(category) && (
                          <X className="ml-1 h-3 w-3" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Country */}
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={filters.country}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, country: value }))
                    }
                  >
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Countries</SelectItem>
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* City */}
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="Enter city name"
                    value={filters.city}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, city: e.target.value }))
                    }
                  />
                </div>

                {/* Listing Type */}
                <div className="space-y-2">
                  <Label>Listing Type</Label>
                  <div className="flex gap-2">
                    <Badge
                      variant={filters.premium === null ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setFilters((prev) => ({ ...prev, premium: null }))}
                    >
                      All
                    </Badge>
                    <Badge
                      variant={filters.premium === true ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setFilters((prev) => ({ ...prev, premium: true }))}
                    >
                      Premium Only
                    </Badge>
                    <Badge
                      variant={filters.premium === false ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setFilters((prev) => ({ ...prev, premium: false }))}
                    >
                      Free Only
                    </Badge>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <Button onClick={clearFilters} variant="outline" className="flex-1">
                    Clear All
                  </Button>
                  <Button
                    onClick={() => {
                      handleSearch();
                      setFiltersOpen(false);
                    }}
                    className="flex-1"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.category.map((cat) => (
            <Badge key={cat} variant="secondary">
              {cat}
              <button
                onClick={() => toggleCategory(cat)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.country && (
            <Badge variant="secondary">
              {filters.country}
              <button
                onClick={() => setFilters((prev) => ({ ...prev, country: '' }))}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.city && (
            <Badge variant="secondary">
              {filters.city}
              <button
                onClick={() => setFilters((prev) => ({ ...prev, city: '' }))}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
