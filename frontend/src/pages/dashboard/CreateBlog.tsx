import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateBlog } from '../../services/blog.service';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { useGetMyListings } from '../../services/listing.service';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const createBlogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  banner_image: z.string().optional(),
  tags: z.string().optional(), // Will be split by comma
  listing_id: z.string().min(1, 'Listing is required'),
});

export function CreateBlog() {
  const navigate = useNavigate();
  const createBlogMutation = useCreateBlog();
  const { data: listings, isLoading: isLoadingListings } = useGetMyListings();

  const form = useForm<z.infer<typeof createBlogSchema>>({
    resolver: zodResolver(createBlogSchema),
    defaultValues: {
      title: '',
      content: '',
      excerpt: '',
      banner_image: '',
      tags: '',
      listing_id: '',
    },
  });

  const onSubmit = (values: z.infer<typeof createBlogSchema>) => {
    const formattedValues = {
      ...values,
      tags: values.tags ? values.tags.split(',').map(tag => tag.trim()) : [],
    };
    createBlogMutation.mutate(formattedValues as any, {
      onSuccess: () => {
        toast.success('Blog post created successfully!');
        navigate('/dashboard/blogs');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to create blog post.');
      },
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create New Blog Post</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="listing_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Associated Listing</FormLabel>
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
                  <Input placeholder="Blog Post Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="excerpt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Excerpt</FormLabel>
                <FormControl>
                  <Textarea placeholder="A short summary of your blog post" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea placeholder="Write your blog post content here..." rows={10} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="banner_image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Banner Image URL (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags (Comma-separated)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., business, marketing, diaspora" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={createBlogMutation.isPending}>
            {createBlogMutation.isPending ? 'Creating...' : 'Create Blog Post'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
