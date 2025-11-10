import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetBlog } from '../services/blog.service';
import { useTrackAnalyticEvent, AnalyticEventType } from '../services/analytic.service';
import { Card, CardContent, CardTitle } from '../components/ui/card';
import { Calendar, User } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { HeroSection } from '../components/layout/HeroSection';

export function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: blog, isLoading, error } = useGetBlog(id!);
  const { mutate: trackEvent } = useTrackAnalyticEvent();

  useEffect(() => {
    if (blog) {
      trackEvent({
        listingId: blog.listing_id,
        eventType: AnalyticEventType.VIEW,
      });
    }
  }, [blog, trackEvent]);

  const publishDate = blog ? new Date(blog.published_date) : null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {blog && (
        <HeroSection
          title={blog.title}
          description={`By ${blog.author.name}`}
        />
      )}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error fetching blog post.</p>
        ) : blog && publishDate ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center gap-3 text-muted-foreground" style={{ fontSize: '12px' }}>
                <div className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  <span>{blog.author.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formatDate(publishDate)}</span>
                </div>
              </div>
              <p className="mt-4">{blog.excerpt}</p>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Read More</AccordionTrigger>
                  <AccordionContent>
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: blog.content }} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        ) : (
          <p>Blog post not found.</p>
        )}
      </div>
    </div>
  );
}
