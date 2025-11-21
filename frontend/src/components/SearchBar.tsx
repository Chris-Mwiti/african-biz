import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { CATEGORIES, COUNTRIES } from '../lib/mockData';
import { useSearchListings } from '../services/listing.service';
import { Link } from 'react-router-dom';
import {
  FilterSheet,
  FilterGroup,
  FilterBadge,
  CountrySelect,
  CityInput,
  ListingTypeFilter,
} from './Filter';
import { SheetTrigger } from './ui/sheet';

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
          <FilterSheet
            open={filtersOpen}
            onOpenChange={setFiltersOpen}
            onApply={handleSearch}
            onClear={clearFilters}
          >
            <SheetTrigger asChild>
              <Button variant="outline" className="h-12 px-4" onClick={() => setFiltersOpen(true)}>
                <Filter className="h-5 w-5" />
                <span className="ml-2 hidden sm:inline">Filters</span>
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <FilterGroup label="Categories">
              {CATEGORIES.map((category) => (
                <FilterBadge
                  key={category}
                  filter={{ value: category, label: category }}
                  isActive={filters.category.includes(category)}
                  onClick={toggleCategory}
                />
              ))}
            </FilterGroup>
            <CountrySelect
              value={filters.country}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, country: value }))
              }
              countries={COUNTRIES.map(c => ({ value: c, label: c }))}
            />
            <CityInput
              value={filters.city}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, city: e.target.value }))
              }
            />
            <ListingTypeFilter
              value={filters.premium}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, premium: value }))
              }
            />
          </FilterSheet>
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
