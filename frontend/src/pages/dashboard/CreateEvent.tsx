import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateEvent } from '../../services/event.service';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { useGetMyListings } from '../../services/listing.service';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  start_datetime: z.string().min(1, 'Start date is required'),
  end_datetime: z.string().min(1, 'End date is required'),
  location: z.string().min(1, 'Location is required'),
  listing_id: z.string().min(1, 'Listing is required'),
});

export function CreateEvent() {
  const createEventMutation = useCreateEvent();
  const { data: listings, isLoading: isLoadingListings } = useGetMyListings();

  const form = useForm<z.infer<typeof createEventSchema>>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: '',
      description: '',
      start_datetime: '',
      end_datetime: '',
      location: '',
      listing_id: '',
    },
  });

  const onSubmit = (values: z.infer<typeof createEventSchema>) => {
    createEventMutation.mutate(values);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create Event</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="listing_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Listing</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a listing" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingListings ? (
                      <SelectItem value="loading" disabled>Loading...</SelectItem>
                    ) : (
                      listings?.map((listing) => (
                        <SelectItem key={listing.id} value={listing.id}>
                          {listing.title}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Event Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Event Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="start_datetime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date and Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="end_datetime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date and Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Event Location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={createEventMutation.isPending}>
            {createEventMutation.isPending ? 'Creating...' : 'Create Event'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
