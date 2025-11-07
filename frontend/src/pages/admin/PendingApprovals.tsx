import { useState } from 'react';
import { CheckCircle2, XCircle, Eye, Crown } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { toast } from 'sonner';
import { useGetPendingListings, useApproveListing, useRejectListing } from '../../services/admin.service';
import { AdminListing } from '../../lib/types';
import { Link } from 'react-router-dom';

export function PendingApprovals() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedListing, setSelectedListing] = useState<AdminListing | null>(null);
  const [actionDialog, setActionDialog] = useState<'approve' | 'reject' | null>(null);

  const { data, isLoading, isError, error } = useGetPendingListings({ page, pageSize });

  const listings = data?.listings || [];
  const totalPages = data?.totalPages || 1;

  const approveListingMutation = useApproveListing();
  const rejectListingMutation = useRejectListing();

  const handleApprove = (listingId: string) => {
    approveListingMutation.mutate(listingId, {
      onSuccess: () => {
        toast.success(`Listing approved successfully!`);
        setActionDialog(null);
        setSelectedListing(null);
      },
      onError: (err) => {
        toast.error(`Failed to approve listing: ${err.message}`);
      },
    });
  };

  const handleReject = (listingId: string) => {
    rejectListingMutation.mutate(listingId, {
      onSuccess: () => {
        toast.error(`Listing rejected successfully!`);
        setActionDialog(null);
        setSelectedListing(null);
      },
      onError: (err) => {
        toast.error(`Failed to reject listing: ${err.message}`);
      },
    });
  };

  if (isLoading) return <div>Loading pending approvals...</div>;
  if (isError) return <div>Error loading pending approvals: {error?.message}</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-muted/30 px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-2">Pending Approvals</h1>
          <p className="text-muted-foreground">
            Review and approve or reject new business listings
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl p-6">
        {listings.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business Name</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listings.map((listing) => (
                    <TableRow key={listing.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{listing.title}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {listing.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{listing.owner_name}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="secondary" className="text-xs">
                            {listing.category_name}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {listing.city}, {listing.country}
                      </TableCell>
                      <TableCell>
                        {listing.is_premium ? (
                          <Badge className="bg-secondary text-secondary-foreground">
                            <Crown className="mr-1 h-3 w-3" />
                            Premium
                          </Badge>
                        ) : (
                          <Badge variant="outline">Free</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(listing.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/listing/${listing.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-accent hover:bg-accent/90"
                            onClick={() => {
                              setSelectedListing(listing);
                              setActionDialog('approve');
                            }}
                          >
                            <CheckCircle2 className="mr-1 h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setSelectedListing(listing);
                              setActionDialog('reject');
                            }}
                          >
                            <XCircle className="mr-1 h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
              <CheckCircle2 className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2">All caught up!</h3>
              <p className="text-muted-foreground">
                There are no pending listings to review at this time.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>

      {/* Approve Dialog */}
      {selectedListing && actionDialog === 'approve' && (
        <AlertDialog open onOpenChange={() => setActionDialog(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Approve Listing</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to approve "{selectedListing.title}"? This listing will
                become visible to all users.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleApprove(selectedListing.id)}
                className="bg-accent hover:bg-accent/90"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Approve
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Reject Dialog */}
      {selectedListing && actionDialog === 'reject' && (
        <AlertDialog open onOpenChange={() => setActionDialog(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reject Listing</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to reject "{selectedListing.title}"? This action cannot be
                undone. The owner will be notified.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleReject(selectedListing.id)}
                className="bg-destructive hover:bg-destructive/90"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
