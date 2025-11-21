
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
  } from './ui/sheet';
  import { Badge } from './ui/badge';
  import { Button } from './ui/button';
  import { Input } from './ui/input';
  import { Label } from './ui/label';
  import { X } from 'lucide-react';
  
  export interface Filter {
    value: string;
    label: string;
  }
  
  interface FilterBadgeProps {
    filter: Filter;
    isActive: boolean;
    onClick: (value: string) => void;
  }
  
  export function FilterBadge({ filter, isActive, onClick }: FilterBadgeProps) {
    return (
      <Badge
        variant={isActive ? 'default' : 'outline'}
        className="cursor-pointer"
        onClick={() => onClick(filter.value)}
      >
        {filter.label}
        {isActive && <X className="ml-1 h-3 w-3" />}
      </Badge>
    );
  }
  
  interface FilterGroupProps {
    label: string;
    children: React.ReactNode;
  }
  
  export function FilterGroup({ label, children }: FilterGroupProps) {
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="flex flex-wrap gap-2">{children}</div>
      </div>
    );
  }
  
  interface FilterSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
    onApply: () => void;
    onClear: () => void;
  }
  
  export function FilterSheet({
    open,
    onOpenChange,
    children,
    onApply,
    onClear,
  }: FilterSheetProps) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Filter Listings</SheetTitle>
            <SheetDescription>
              Refine your search with advanced filters
            </SheetDescription>
          </SheetHeader>
  
          <div className="mt-6 space-y-6">{children}</div>
  
          <div className="flex gap-2 pt-4">
            <Button onClick={onClear} variant="outline" className="flex-1">
              Clear All
            </Button>
            <Button
              onClick={() => {
                onApply();
                onOpenChange(false);
              }}
              className="flex-1"
            >
              Apply Filters
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }
  
  interface CountrySelectProps {
    value: string;
    onValueChange: (value: string) => void;
    countries: Filter[];
  }
  
  export function CountrySelect({
    value,
    onValueChange,
    countries,
  }: CountrySelectProps) {
    return (
      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger id="country">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {countries.map((country) => (
              <SelectItem key={country.value} value={country.value}>
                {country.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }
  
  interface CityInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }
  
  export function CityInput({ value, onChange }: CityInputProps) {
    return (
      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          placeholder="Enter city name"
          value={value}
          onChange={onChange}
        />
      </div>
    );
  }
  
  interface ListingTypeFilterProps {
    value: boolean | null;
    onValueChange: (value: boolean | null) => void;
  }
  
  export function ListingTypeFilter({
    value,
    onValueChange,
  }: ListingTypeFilterProps) {
    const types: { label: string; value: boolean | null }[] = [
      { label: 'All', value: null },
      { label: 'Premium Only', value: true },
      { label: 'Free Only', value: false },
    ];
  
    return (
      <FilterGroup label="Listing Type">
        {types.map((type) => (
          <Badge
            key={String(type.value)}
            variant={value === type.value ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => onValueChange(type.value)}
          >
            {type.label}
          </Badge>
        ))}
      </FilterGroup>
    );
  }
