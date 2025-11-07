import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api';
import { BlogPost } from '@/lib/types'; // Assuming Blog type is defined here
import { toast } from 'sonner'; // Assuming sonner is used for notifications

export const UserBlogs: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: blogs, isLoading, isError, error } = useQuery<BlogPost[], Error>({
    queryKey: ['userBlogs'],
    queryFn: async () => {
      const response = await api.get('/blogs/me'); // Assuming an endpoint to get current user's blogs
      return response.data;
    },
  });

  const deleteBlogMutation = useMutation<void, Error, string>({
    mutationFn: async (blogId: string) => {
      await api.delete(`/blogs/${blogId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userBlogs'] });
      toast.success('Blog deleted successfully!');
    },
    onError: (err) => {
      toast.error(`Failed to delete blog: ${err.message}`);
    },
  });

  const handleDelete = (blogId: string) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      deleteBlogMutation.mutate(blogId);
    }
  };

  if (isLoading) return <div>Loading blogs...</div>;
  if (isError) return <div>Error loading blogs: {error?.message}</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Blogs</h1>
        <Button asChild>
          <Link to="/dashboard/my-blogs/new">Create New Blog</Link>
        </Button>
      </div>

      {blogs && blogs.length === 0 ? (
        <p>You haven't created any blogs yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs?.map((blog) => (
            <Card key={blog.id}>
              <CardHeader>
                <CardTitle>{blog.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-3">{blog.content}</p>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/dashboard/my-blogs/edit/${blog.id}`}>Edit</Link>
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(blog.id)}>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBlogs;
