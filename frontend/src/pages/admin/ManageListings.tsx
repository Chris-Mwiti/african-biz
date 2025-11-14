import { useState } from 'react';
import { Menu } from '@headlessui/react';
import { Button } from '../../components/ui/button';
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
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';
import { useGetAdminListings, useUpdateListingStatus, useUpgradeListingToPremium, useDeleteListing } from '../../services/admin.service';
import { MoreHorizontal } from 'lucide-react';

export function ManageListings() {
  const [params, setParams] = useState({ page: 1, pageSize: 10 });
  const { data, isLoading, isError } = useGetAdminListings(params);
  const updateStatusMutation = useUpdateListingStatus();
  const upgradeMutation = useUpgradeListingToPremium();
  const deleteMutation = useDeleteListing();

  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState<(() => void) | null>(null);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmDescription, setConfirmDescription] = useState('');

  const handleActionConfirm = (action: () => void, title: string, description: string) => {
    setActionToConfirm(() => action);
    setConfirmTitle(title);
    setConfirmDescription(description);
    setConfirmOpen(true);
  };

  const executeConfirmedAction = () => {
    if (actionToConfirm) {
      actionToConfirm();
    }
    setConfirmOpen(false);
    setActionToConfirm(null);
  };

  const handleUpdateStatus = (id: string, status: string) => {
    const action = () => {
      updateStatusMutation.mutate({ id, status }, {
        onSuccess: () => toast.success(`Listing ${status.toLowerCase()}ed successfully.`),
        onError: () => toast.error('Failed to update listing status.'),
      });
    };
    handleActionConfirm(action, `Confirm ${status.toLowerCase()}`, `Are you sure you want to ${status.toLowerCase()} this listing?`);
  };

  const handleUpgrade = (id: string) => {
    const action = () => {
      upgradeMutation.mutate(id, {
        onSuccess: () => toast.success('Listing upgraded to premium.'),
        onError: () => toast.error('Failed to upgrade listing.'),
      });
    };
    handleActionConfirm(action, 'Confirm Upgrade', 'Are you sure you want to upgrade this listing to premium?');
  };

  const handleDelete = (id: string) => {
    const action = () => {
      deleteMutation.mutate(id, {
        onSuccess: () => toast.success('Listing deleted successfully.'),
        onError: () => toast.error('Failed to delete listing.'),
      });
    };
    handleActionConfirm(action, 'Confirm Deletion', 'Are you sure you want to delete this listing? This action cannot be undone.');
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching listings.</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Listings</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Premium</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.listings.map((listing: any) => (
            <TableRow key={listing.id}>
              <TableCell>{listing.title}</TableCell>
              <TableCell>{listing.owner_name}</TableCell>
              <TableCell>{listing.category_name}</TableCell>
              <TableCell>
                <Badge variant={listing.status === 'ACTIVE' ? 'default' : 'secondary'}>
                  {listing.status}
                </Badge>
              </TableCell>
              <TableCell>{listing.is_premium ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button as={Button} variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Menu.Button>
                  </div>
                  <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="px-1 py-1 ">
                      {listing.status != 'ACTIVE' && (
                        <>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => handleUpdateStatus(listing.id, 'ACTIVE')}
                                className={`${
                                  active ? 'bg-violet-500 text-white' : 'text-gray-900'
                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                              >
                                Approve
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => handleUpdateStatus(listing.id, 'REJECTED')}
                                className={`${
                                  active ? 'bg-violet-500 text-white' : 'text-gray-900'
                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                              >
                                Reject
                              </button>
                            )}
                          </Menu.Item>
                        </>
                      )}
                      {!listing.is_premium && (
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => handleUpgrade(listing.id)}
                              className={`${
                                active ? 'bg-violet-500 text-white' : 'text-gray-900'
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            >
                              Upgrade to Premium
                            </button>
                          )}
                        </Menu.Item>
                      )}
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => handleDelete(listing.id)}
                            className={`${
                              active ? 'bg-violet-500 text-white' : 'text-red-900'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            Delete
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Menu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between mt-4">
        <Button
          variant="outline"
          onClick={() => setParams(prev => ({ ...prev, page: prev.page - 1 }))}
          disabled={params.page <= 1}
        >
          Previous
        </Button>
        <span>
          Page {data.page} of {data.totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => setParams(prev => ({ ...prev, page: prev.page + 1 }))}
          disabled={params.page >= data.totalPages}
        >
          Next
        </Button>
      </div>

      <AlertDialog open={isConfirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>{confirmDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={executeConfirmedAction}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
