import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Event } from '../lib/types';
import LazyImage from './ui/LazyImage';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const startDate = new Date(event.start_datetime);
  const endDate = new Date(event.end_datetime);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <Link to={`/event/${event.id}`}>
        <div className="relative h-48 overflow-hidden bg-muted">
          <LazyImage
            src={event.banner_image}
            alt={event.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            placeholderSrc="https://via.placeholder.com/400x200"
          />
          <div className="absolute left-3 top-3">
            <Badge className="bg-primary text-primary-foreground">Event</Badge>
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link to={`/event/${event.id}`}>
          {/* Business Name */}
          <p className="mb-2 text-muted-foreground" style={{ fontSize: '12px' }}>
            {event.listing.title}
          </p>

          {/* Title */}
          <h3 className="mb-2 line-clamp-2 transition-colors group-hover:text-primary">
            {event.title}
          </h3>

          {/* Date & Time */}
          <div className="mb-2 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span style={{ fontSize: '14px' }}>{formatDate(startDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span style={{ fontSize: '14px' }}>
                {formatTime(startDate)} - {formatTime(endDate)}
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="mb-4 flex items-start gap-2 text-muted-foreground">
            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-2" style={{ fontSize: '14px' }}>
              {event.location}
            </span>
          </div>
        </Link>

        <Button asChild className="w-full" size="sm">
          <Link to={`/event/${event.id}`}>View Details</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
