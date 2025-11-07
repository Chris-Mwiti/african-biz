import { useGetEvents } from '../services/event.service';
import { EventCard } from '../components/EventCard';

export function Events() {
  const { data: events, isLoading, error } = useGetEvents();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-2">Events</h1>
          <p className="text-muted-foreground">
            Discover events hosted by African businesses in the diaspora
          </p>
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error fetching events.</p>
        ) : events && events.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p>No events found.</p>
        )}
      </div>
    </div>
  );
}