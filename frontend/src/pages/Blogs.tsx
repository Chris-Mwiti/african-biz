import { useState, useEffect } from 'react';
import { useGetBlogs } from '../services/blog.service';
import { BlogCard } from '../components/BlogCard';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { useDebounce } from '../hooks/useDebounce';
import { useGetCategories } from '../services/category.service';
import { HeroSection } from '../components/layout/HeroSection';
import { CategoryTagCard } from '../components/CategoryTagCard';

export function Blogs() {
  const [searchAuthor, setSearchAuthor] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showRecent, setShowRecent] = useState<boolean>(false);

  const debouncedAuthor = useDebounce(searchAuthor, 500);

  const { data: categories, isLoading: isLoadingCategories } = useGetCategories();
  const { data: blogs, isLoading, error } = useGetBlogs({
    authorId: debouncedAuthor || undefined,
    categoryId: selectedCategory || undefined,
    recent: showRecent,
  });

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory((prev) => (prev === categoryId ? '' : categoryId));
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection
        title="Blog Posts"
        description="Read the latest stories, tips, and insights from our community"
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search and Filter Section */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Input
            placeholder="Search by author..."
            value={searchAuthor}
            onChange={(e) => setSearchAuthor(e.target.value)}
          />
          <div className="flex items-center space-x-2">
            <Checkbox
              id="recent"
              checked={showRecent}
              onCheckedChange={(checked) => setShowRecent(checked as boolean)}
            />
            <Label htmlFor="recent">Show Recent Posts</Label>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Filter by Category</h3>
          {isLoadingCategories ? (
            <p>Loading categories...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories?.map((category) => (
                <CategoryTagCard
                  key={category.id}
                  category={category}
                  isSelected={selectedCategory === category.id}
                  onClick={() => handleCategorySelect(category.id)}
                />
              ))}
            </div>
          )}
        </div>

        {isLoading ? (
          <p>Loading blog posts...</p>
        ) : error ? (
          <p>Error fetching blog posts.</p>
        ) : blogs && blogs.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <p>No blog posts found matching your criteria.</p>
        )}
      </div>
    </div>
  );
}
