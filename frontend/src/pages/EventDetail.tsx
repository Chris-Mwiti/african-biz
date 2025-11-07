import { useParams } from 'react-router-dom';
import { useGetEvent } from '../services/event.service';
import { EventCard } from '@/components/EventCard';

export function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: event, isLoading, error } = useGetEvent(id!);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error fetching event.</p>
        ) : event ? (
          <EventCard event={event} />
       ) : (
          <p>Event not found.</p>
        )}
      </div>
    </div>
  );
}
