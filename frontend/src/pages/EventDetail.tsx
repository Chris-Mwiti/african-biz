import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetEvent } from '../services/event.service';
import { useTrackAnalyticEvent, AnalyticEventType } from '../services/analytic.service';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { CalendarIcon, MapPinIcon } from 'lucide-react';

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
        <div
          className="h-96 bg-cover bg-center bg-no-repeat relative"
          style={{ backgroundImage: `url(${event.banner_image})` }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-lg" />
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {event.title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg">
              {event.location}
            </p>
          </div>
        </div>
      )}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error fetching event.</p>
        ) : event ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <img
                src={event.banner_image}
                alt={event.title}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{event.description}</p>
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
        ) : (
          <p>Event not found.</p>
        )}
      </div>
    </div>
  );
}
