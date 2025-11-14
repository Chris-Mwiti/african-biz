import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGetBlog, useUpdateBlog } from '../../services/blog.service';
import { useGetMyListings } from '../../services/listing.service';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import CloudinaryUploadWidget from '../../components/CloudinaryUploadWidget';

const updateBlogSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  content: z.string().min(1, 'Content is required').optional(),
  excerpt: z.string().min(1, 'Excerpt is required').optional(),
  banner_image: z.string().optional(),
  tags: z.string().optional(),
  listing_id: z.string().min(1, 'Listing is required').optional(),
});

export function EditBlog() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: blog, isLoading: isLoadingBlog } = useGetBlog(id!);
  const { data: listings, isLoading: isLoadingListings } = useGetMyListings();
  const updateBlogMutation = useUpdateBlog(id!);
  const [bannerImage, setBannerImage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof updateBlogSchema>>({
    resolver: zodResolver(updateBlogSchema),
  });

  useEffect(() => {
    if (blog) {
      form.reset({
        title: blog.title,
        content: blog.content,
        excerpt: blog.excerpt,
        banner_image: blog.banner_image,
        tags: blog.tags?.join(', '),
        listing_id: blog.listing_id,
      });
      setBannerImage(blog.banner_image);
    }
  }, [blog, form]);

  const onSubmit = (values: z.infer<typeof updateBlogSchema>) => {
    const formattedValues = {
      ...values,
      tags: values.tags ? values.tags.split(',').map(tag => tag.trim()) : [],
      banner_image: bannerImage || '',
    };
    updateBlogMutation.mutate(formattedValues as any, {
      onSuccess: () => {
        toast.success('Blog post updated successfully!');
        navigate('/dashboard/blogs');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to update blog post.');
      },
    });
  };

  if (isLoadingBlog) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Blog Post</h1>
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
          <FormItem>
            <FormLabel>Banner Image</FormLabel>
            <FormControl>
              <CloudinaryUploadWidget
                onUploadSuccess={(url) => setBannerImage(url)}
                cloudName={import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || ''}
                uploadPreset={import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || ''}
                buttonText="Upload Banner Image"
              />
            </FormControl>
            {bannerImage && (
              <div className="mt-4">
                <img src={bannerImage} alt="Banner" className="w-full h-auto rounded-md" />
              </div>
            )}
            <FormMessage />
          </FormItem>
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
          <Button type="submit" disabled={updateBlogMutation.isPending}>
            {updateBlogMutation.isPending ? 'Updating...' : 'Update Blog Post'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
