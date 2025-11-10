import { Link } from 'react-router-dom';
import { MapPin, Star, Crown, CheckCircle2, Phone, Mail } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Listing, ListingStatus } from '../lib/types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ListingCardProps {
  listing: Listing;
  variant?: 'default' | 'featured' | 'compact';
}

export function ListingCard({ listing, variant = 'default' }: ListingCardProps) {
  const isFeatured = variant === 'featured' || listing.is_premium;
  const isCompact = variant === 'compact';
  console.log(listing.images)

  return (
    <Card className={`group overflow-hidden transition-all hover:shadow-lg ${
      isFeatured ? 'border-secondary/50 shadow-md' : ''
    }`}>
      <Link to={`/listing/${listing.id}`}>
        {/* Image */}
        <div className={`relative overflow-hidden bg-muted ${
          isCompact ? 'h-40' : 'h-48'
        }`}>
          {listing.images && listing.images.length > 0 ? (
            <ImageWithFallback
              src={listing.images[0]}
              alt={listing.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}

          {/* Badges Overlay */}
          <div className="absolute left-2 top-2 flex flex-wrap gap-1">
            {listing.is_premium && (
              <Badge className="bg-secondary text-secondary-foreground">
                <Crown className="mr-1 h-3 w-3" />
                Premium
              </Badge>
            )}
            {listing.verified && (
              <Badge className="bg-accent text-accent-foreground">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Verified
              </Badge>
            )}
          </div>

          {/* Status Badge */}
          {listing.status == "PENDING"&& (
            <div className="absolute right-2 top-2">
              <Badge variant="outline" className="bg-background/90">
                Pending
              </Badge>
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <Link to={`/listing/${listing.id}`}>
          {/* Category Tags */}
          <div className="mb-2 flex flex-wrap gap-1">
            {listing.category && (
              <span
                key={listing.category.id}
                className="rounded-full bg-muted px-2 py-0.5"
                style={{ fontSize: '12px' }}
              >
                {listing.category.name}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="mb-1 line-clamp-1 transition-colors group-hover:text-primary">
            {listing.title}
          </h3>

          {/* Location */}
          <div className="mb-2 flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span style={{ fontSize: '14px' }}>
              {listing.city}, {listing.country}
            </span>
          </div>

          {/* Rating */}
          {listing.rating && (
            <div className="mb-3 flex items-center gap-1">
              <Star className="h-4 w-4 fill-secondary text-secondary" />
              <span style={{ fontSize: '14px' }}>
                {listing.rating.toFixed(1)}
              </span>
              <span className="text-muted-foreground" style={{ fontSize: '14px' }}>
                ({listing.views_count} views)
              </span>
            </div>
          )}

          {/* Description */}
          {!isCompact && (
            <p className="mb-4 line-clamp-2 text-muted-foreground" style={{ fontSize: '14px' }}>
              {listing.description}
            </p>
          )}
        </Link>

        {/* Actions */}
        <div className="flex gap-2">
          <Button asChild className="flex-1" size="sm">
            <Link to={`/listing/${listing.id}`}>View Listing</Link>
          </Button>
          {listing.phone && (
            <Button variant="outline" size="sm" asChild>
              <a href={`tel:${listing.phone}`}>
                <Phone className="h-4 w-4" />
              </a>
            </Button>
          )}
          {listing.email && (
            <Button variant="outline" size="sm" asChild>
              <a href={`mailto:${listing.email}`}>
                <Mail className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
