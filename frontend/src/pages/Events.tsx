import { useState } from 'react';
import { useGetEvents } from '../services/event.service';
import { EventCard } from '../components/EventCard';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Menu } from '@headlessui/react';

import { cn } from '../utils/cn';
import { Button } from '../components/ui/button';
import { Calendar } from '../components/ui/calendar';
import { HeroSection } from '../components/layout/HeroSection';
import { DateRange } from 'react-day-picker';

export function Events() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const { data: events, isLoading, error } = useGetEvents({
    startDate: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
    endDate: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
  });

  return (
    <div className="min-h-screen bg-background">
      <HeroSection
        title="Events"
        description="Discover events hosted by African businesses in the diaspora"
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Date Filter Section */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button as={Button} variant={'outline'} className={cn(
                'w-[280px] justify-start text-left font-normal',
                !dateRange && 'text-muted-foreground'
              )}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, 'LLL dd, y')} -{' '}
                      {format(dateRange.to, 'LLL dd, y')}
                    </>
                  ) : (
                    format(dateRange.from, 'LLL dd, y')
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Menu.Button>
            </div>
            <Menu.Items className="absolute right-0 mt-2 w-auto origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </Menu.Items>
          </Menu>

          {(dateRange?.from || dateRange?.to) && (
            <Button variant="outline" onClick={() => setDateRange(undefined)}>
              Clear Dates
            </Button>
          )}
        </div>

        {isLoading ? (
          <p>Loading events...</p>
        ) : error ? (
          <p>Error fetching events.</p>
        ) : events && events.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p>No events found matching your criteria.</p>
        )}
      </div>
    </div>
  );
}
