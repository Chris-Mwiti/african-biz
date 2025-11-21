
import { Link, useLocation, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useGetListing } from '../../services/listing.service';
import { useGetEvent } from '../../services/event.service';
import { useGetBlog } from '../../services/blog.service';

const breadcrumbNameMap: { [key: string]: string } = {
  '/find-listings': 'Listings',
  '/listing': 'Listing',
  '/events': 'Events',
  '/event': 'Event',
  '/blogs': 'Blogs',
  '/blog': 'Blog',
  '/pricing': 'Pricing',
  '/contact': 'Contact',
  '/dashboard': 'Dashboard',
  '/admin': 'Admin',
};

function DynamicBreadcrumbName({ path }: { path: string }) {
  const params = useParams<{ id: string }>();
  const id = params.id || '';

  if (path === 'listing' && id) {
    const { data: listing } = useGetListing(id);
    return <>{listing?.title || id}</>;
  }

  if (path === 'event' && id) {
    const { data: event } = useGetEvent(id);
    return <>{event?.title || id}</>;
  }

  if (path === 'blog' && id) {
    const { data: blog } = useGetBlog(id);
    return <>{blog?.title || id}</>;
  }

  return <>{breadcrumbNameMap[`/${path}`] || path.charAt(0).toUpperCase() + path.slice(1)}</>;
}

export function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="container flex items-center space-x-2 py-4 mx-3">
      <Link to="/" className="text-muted-foreground hover:text-foreground">
        Home
      </Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        return (
          <span key={to} className="flex items-center space-x-2">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            {isLast ? (
              <span className="font-medium text-foreground">
                <DynamicBreadcrumbName path={value} />
              </span>
            ) : (
              <Link to={to} className="text-muted-foreground hover:text-foreground">
                <DynamicBreadcrumbName path={value} />
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
