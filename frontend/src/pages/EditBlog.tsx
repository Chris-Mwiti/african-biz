import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetMyListings } from '../services/listing.service';
import z from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BlogPost } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/api';
import { useEffect } from 'react';
import { CreateBlogDto, UpdateBlogDto } from '@/dto/blog.dto';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const blogFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  listing_id: z.string().min(1, 'Listing is required'),
  // Add other fields as necessary, e.g., category, tags, image
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

const EditBlog: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const { data: blog, isLoading: isBlogLoading, isError: isBlogError, error: blogError } = useQuery<BlogPost, Error>({
    queryKey: ['blog', id],
    queryFn: async () => {
      const response = await api.get(`/blogs/${id}`);
      return response.data;
    },
    enabled: isEditing, // Only fetch if in editing mode
  });

  const { data: listings, isLoading: isLoadingListings } = useGetMyListings();

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: '',
      content: '',
      listing_id: '',
    },
  });

  useEffect(() => {
    if (isEditing && blog) {
      form.reset({
        title: blog.title,
        content: blog.content,
        listing_id: blog.listing_id, // Set listing_id for editing
      });
    }
  }, [isEditing, blog, form]);

  const createBlogMutation = useMutation<BlogPost, Error, CreateBlogDto>({
    mutationFn: async (newBlogData: CreateBlogDto) => {
      const response = await api.post('/blogs', newBlogData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userBlogs'] });
      toast.success('Blog created successfully!');
      navigate('/dashboard/my-blogs');
    },
    onError: (err) => {
      toast.error(`Failed to create blog: ${err.message}`);
    },
  });

  const updateBlogMutation = useMutation<BlogPost, Error, UpdateBlogDto>({
    mutationFn: async (updatedBlogData: UpdateBlogDto) => {
      const response = await api.put(`/blogs/${id}`, updatedBlogData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userBlogs'] });
      queryClient.invalidateQueries({ queryKey: ['blog', id] });
      toast.success('Blog updated successfully!');
      navigate('/dashboard/my-blogs');
    },
    onError: (err) => {
      toast.error(`Failed to update blog: ${err.message}`);
    },
  });

  const onSubmit = (values: BlogFormValues) => {
    if (isEditing) {
      updateBlogMutation.mutate(values);
    } else {
      createBlogMutation.mutate(values);
    }
  };

  if (isEditing && isBlogLoading) return <div>Loading blog...</div>;
  if (isEditing && isBlogError) return <div>Error loading blog: {blogError?.message}</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">{isEditing ? 'Edit Blog' : 'Create New Blog'}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="listing_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Associate with Listing</FormLabel>
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
                  <Input placeholder="Blog Title" {...field} />
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
                  <Textarea placeholder="Blog Content" {...field} rows={10} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={createBlogMutation.isPending || updateBlogMutation.isPending}>
            {isEditing ? 'Update Blog' : 'Create Blog'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EditBlog;
