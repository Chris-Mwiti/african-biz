import { useGetBlogs } from '../services/blog.service';
import { BlogCard } from '../components/BlogCard';

export function Blogs() {
  const { data: blogs, isLoading, error } = useGetBlogs();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2">Blog Posts</h1>
          <p className="text-muted-foreground">
            Read the latest stories, tips, and insights from our community
          </p>
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error fetching blog posts.</p>
        ) : blogs && blogs.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <p>No blog posts found.</p>
        )}
      </div>
    </div>
  );
}