import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetEvent } from '../services/event.service';
import { useTrackAnalyticEvent, AnalyticEventType } from '../services/analytic.service';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { CalendarIcon, MapPinIcon } from 'lucide-react';
import { HeroSection } from '../components/layout/HeroSection';

export function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: event, isLoading, error } = useGetEvent(id!);
  const { mutate: trackEvent } = useTrackAnalyticEvent();

  useEffect(() => {
    if (event) {
      trackEvent({
        listingId: event.listing_id,
        eventType: AnalyticEventType.VIEW,
      });
    }
  }, [event, trackEvent]);

  return (
    <div className="min-h-screen bg-background">
      {event && (
        <HeroSection
          title={event.title}
          description={event.location}
        />
      )}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error fetching event.</p>
        ) : event ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <p>{event.description}</p>
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Event Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-muted-foreground">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <span>{new Date(event.start_datetime).toLocaleString()} - {new Date(event.end_datetime).toLocaleString()}</span>
                    </div>
                    <div className="mt-2 flex items-center text-muted-foreground">
                      <MapPinIcon className="mr-2 h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">
                      Hosted by: {event.listing.title}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <p>Event not found.</p>
        )}
      </div>
    </div>
  );
}
