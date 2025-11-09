import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { BlogPost } from '../lib/types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface BlogCardProps {
  blog: BlogPost;
}

export function BlogCard({ blog }: BlogCardProps) {
  const publishDate = new Date(blog.published_date);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  console.log("blog card: ", blog)

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <Link to={`/blog/${blog.id}`}>
        <div className="relative h-48 overflow-hidden bg-muted">
          <ImageWithFallback
            src={blog.banner_image}
            alt={blog.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      </Link>

      <CardContent className="p-4">
        <Link to={`/blog/${blog.id}`}>
          {/* Tags */}
          <div className="mb-2 flex flex-wrap gap-1">
            {blog.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Title */}
          <h3 className="mb-2 line-clamp-2 transition-colors group-hover:text-primary">
            {blog.title}
          </h3>

          {/* Excerpt */}
          <p className="mb-4 line-clamp-3 text-muted-foreground" style={{ fontSize: '14px' }}>
            {blog.excerpt}
          </p>

          {/* Meta */}
          <div className="mb-4 flex flex-wrap items-center gap-3 text-muted-foreground" style={{ fontSize: '12px' }}>
           <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDate(publishDate)}</span>
            </div>
          </div>
        </Link>

        <Button asChild variant="outline" className="w-full" size="sm">
          <Link to={`/blog/${blog.id}`}>Read More</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
