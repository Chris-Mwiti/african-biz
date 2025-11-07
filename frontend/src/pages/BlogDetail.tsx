import { useParams } from 'react-router-dom';
import { useGetBlog } from '../services/blog.service';

export function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: blog, isLoading, error } = useGetBlog(id!);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error fetching blog post.</p>
        ) : blog ? (
          <div>
            <h1 className="mb-2">{blog.title}</h1>
            <p className="text-muted-foreground">By {blog.author.name} on {new Date(blog.published_date).toLocaleDateString()}</p>
            <img src={blog.banner_image} alt={blog.title} className="my-4 w-full rounded-lg object-cover" style={{ maxHeight: '400px' }} />
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>
        ) : (
          <p>Blog post not found.</p>
        )}
      </div>
    </div>
  );
}
