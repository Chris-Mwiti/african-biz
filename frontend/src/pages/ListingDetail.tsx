import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  Crown,
  CheckCircle2,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Share2,
  ArrowLeft,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useGetListing } from '../services/listing.service';
import { useTrackAnalyticEvent, AnalyticEventType } from '../services/analytic.service';

export function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: listing, isLoading, error } = useGetListing(id || '');
  const { mutate: trackEvent } = useTrackAnalyticEvent();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  useEffect(() => {
    if (listing?.id) {
      trackEvent({ listingId: listing.id, eventType: AnalyticEventType.VIEW });
    }
  }, [listing?.id, trackEvent]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2">Listing not found</h2>
          <Button asChild>
            <Link to="/find-listings">Browse Listings</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Button asChild variant="ghost" size="sm">
            <Link to="/find-listings">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Listings
            </Link>
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-6 overflow-hidden rounded-lg">
              {listing.images && listing.images.length > 0 ? (
                <div className="grid gap-2">
                  <div
                    className="relative h-114 w-full cursor-pointer overflow-hidden rounded-lg bg-muted"
                    onClick={() => {
                      setCurrentImage(listing.images[0]);
                      setIsModalOpen(true);
                    }}
                  >
                    <ImageWithFallback
                      src={listing.images[0]}
                      alt={listing.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {listing.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {listing.images.slice(1, 5).map((image, index) => (
                        <div
                          key={index}
                          className="relative h-24 cursor-pointer overflow-hidden rounded-lg bg-muted"
                          onClick={() => {
                            setCurrentImage(image);
                            setIsModalOpen(true);
                          }}
                        >
                          <ImageWithFallback
                            src={image}
                            alt={`${listing.title} ${index + 2}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex h-96 items-center justify-center rounded-lg bg-muted">
                  <span className="text-muted-foreground">No images available</span>
                </div>
              )}
            </div>

            {/* Header */}
            <div className="mb-6">
              <div className="mb-3 flex flex-wrap gap-2">
                <Badge variant="secondary">{listing.category.name}</Badge>
                {listing.is_premium && (
                  <Badge className="bg-secondary text-secondary-foreground">
                    <Crown className="mr-1 h-3 w-3" />
                    Premium
                  </Badge>
                )}
                {listing.verified && (
                  <Badge className="bg-accent text-accent-foreground">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>

              <h1 className="mb-2">{listing.title}</h1>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {listing.city}, {listing.country}
                  </span>
                </div>
                {listing.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-secondary text-secondary" />
                    <span>{listing.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground">({listing.views_count} views)</span>
                  </div>
                )}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Tabs */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-3">About This Business</h3>
                    <p className="text-muted-foreground">{listing.description}</p>
                  </div>

                  <div>
                    <h3 className="mb-3">Location</h3>
                    <p className="text-muted-foreground">{listing.address}</p>
                    <p className="text-muted-foreground">
                      {listing.city}, {listing.country}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contact" className="mt-6">
                <div className="space-y-4">
                  {listing.phone && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <a
                          href={`tel:${listing.phone}`}
                          className="hover:underline"
                          onClick={() => trackEvent({ listingId: listing.id, eventType: AnalyticEventType.CONTACT, details: { method: 'phone' } })}
                        >
                          {listing.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {listing.email && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <a
                          href={`mailto:${listing.email}`}
                          className="hover:underline"
                          onClick={() => trackEvent({ listingId: listing.id, eventType: AnalyticEventType.CONTACT, details: { method: 'email' } })}
                        >
                          {listing.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {listing.website && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Globe className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Website</p>
                        <a
                          href={listing.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                          onClick={() => trackEvent({ listingId: listing.id, eventType: AnalyticEventType.CLICK, details: { link: 'website' } })}
                        >
                          {listing.website}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="flex min-h-[200px] items-center justify-center rounded-lg border-2 border-dashed">
                  <p className="text-muted-foreground">No reviews yet</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Business</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {listing.phone && (
                  <Button asChild className="w-full">
                    <a
                      href={`tel:${listing.phone}`}
                      onClick={() => trackEvent({ listingId: listing.id, eventType: AnalyticEventType.CONTACT, details: { method: 'phone_button' } })}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Call Now
                    </a>
                  </Button>
                )}
                {listing.email && (
                  <Button asChild variant="outline" className="w-full">
                    <a
                      href={`mailto:${listing.email}`}
                      onClick={() => trackEvent({ listingId: listing.id, eventType: AnalyticEventType.CONTACT, details: { method: 'email_button' } })}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Send Email
                    </a>
                  </Button>
                )}
                {listing.website && (
                  <Button asChild variant="outline" className="w-full">
                    <a
                      href={listing.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEvent({ listingId: listing.id, eventType: AnalyticEventType.CLICK, details: { link: 'website_button' } })}
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      Visit Website
                    </a>
                  </Button>
                )}
                <Button variant="outline" className="w-full">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Listing
                </Button>
              </CardContent>
            </Card>

            {/* Social Links */}
            {listing.social_links && (
              <Card>
                <CardHeader>
                  <CardTitle>Connect on Social</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {listing.social_links.facebook && (
                      <Button asChild variant="outline" size="icon">
                        <a
                          href={`https://facebook.com/${listing.social_links.facebook}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackEvent({ listingId: listing.id, eventType: AnalyticEventType.CLICK, details: { link: 'facebook' } })}
                        >
                          <Facebook className="h-5 w-5" />
                        </a>
                      </Button>
                    )}
                    {listing.social_links.instagram && (
                      <Button asChild variant="outline" size="icon">
                        <a
                          href={`https://instagram.com/${listing.social_links.instagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackEvent({ listingId: listing.id, eventType: AnalyticEventType.CLICK, details: { link: 'instagram' } })}
                        >
                          <Instagram className="h-5 w-5" />
                        </a>
                      </Button>
                    )}
                    {listing.social_links.twitter && (
                      <Button asChild variant="outline" size="icon">
                        <a
                          href={`https://twitter.com/${listing.social_links.twitter}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackEvent({ listingId: listing.id, eventType: AnalyticEventType.CLICK, details: { link: 'twitter' } })}
                        >
                          <Twitter className="h-5 w-5" />
                        </a>
                      </Button>
                    )}
                    {listing.social_links.linkedin && (
                      <Button asChild variant="outline" size="icon">
                        <a
                          href={`https://linkedin.com/company/${listing.social_links.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackEvent({ listingId: listing.id, eventType: AnalyticEventType.CLICK, details: { link: 'linkedin' } })}
                        >
                          <Linkedin className="h-5 w-5" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Owner Info */}
            <Card>
              <CardHeader>
                <CardTitle>Business Owner</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{listing.owner_name}</p>
                <p className="text-sm text-muted-foreground">Member since {new Date(listing.created_at).getFullYear()}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-screen-lg p-0">
          {currentImage && (
            <img src={currentImage} alt="Full size listing image" className="h-auto w-full object-contain" />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
