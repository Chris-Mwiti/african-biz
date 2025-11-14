import { useState } from 'react';
import { Users, Shield, Crown, User as UserIcon, MoreHorizontal, Ban, Trash2, Star } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Menu } from '@headlessui/react';
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
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { getInitials } from '../../utils/formatters';
import { toast } from 'sonner';
import { useGetAdminUsers, useUpdateUserStatus, useDeleteUser, useUpdateUserRole, useGetAdminOverviewStats } from '../../services/admin.service';
import { AdminUser, UserStatus } from '../../lib/types';
import { Role } from '@/dto/auth.dto';
import { useDebounce } from '../../hooks/useDebounce';

export function ManageUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);

  const { data, isLoading, isError, error } = useGetAdminUsers({
    search: debouncedSearchQuery,
    page,
    pageSize,
  });

  const { data: overviewStats, isLoading: statsLoading } = useGetAdminOverviewStats();

  const users = data?.users || [];
  const totalPages = data?.totalPages || 1;

  const updateUserStatusMutation = useUpdateUserStatus();
  const deleteUserMutation = useDeleteUser();
  const updateUserRoleMutation = useUpdateUserRole();

  const handleUpdateStatus = (userId: string, currentStatus: UserStatus) => {
    const newStatus = currentStatus === UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE;
    updateUserStatusMutation.mutate({ id: userId, status: newStatus }, {
      onSuccess: () => {
        toast.success(`User status updated to ${newStatus.toLowerCase()}!`);
        setStatusDialogOpen(false);
        setSelectedUser(null);
      },
      onError: (err) => {
        toast.error(`Failed to update user status: ${err.message}`);
      },
    });
  };

  const handleUpdateRole = (userId: string, newRole: Role) => {
    updateUserRoleMutation.mutate({ id: userId, role: newRole }, {
      onSuccess: () => {
        toast.success(`User role updated to ${newRole.toLowerCase()}!`);
        setRoleDialogOpen(false);
        setSelectedUser(null);
      },
      onError: (err) => {
        toast.error(`Failed to update user role: ${err.message}`);
      },
    });
  };

  const handleDelete = (userId: string) => {
    deleteUserMutation.mutate(userId, {
      onSuccess: () => {
        toast.success('User deleted successfully!');
        setDeleteDialogOpen(false);
        setSelectedUser(null);
      },
      onError: (err) => {
        toast.error(`Failed to delete user: ${err.message}`);
      },
    });
  };

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case Role.ADMIN:
        return (
          <Badge className="gap-1 bg-purple-500">
            <Shield className="h-3 w-3" />
            Admin
          </Badge>
        );
      case Role.PREMIUM:
        return (
          <Badge className="gap-1 bg-secondary">
            <Crown className="h-3 w-3" />
            Premium
          </Badge>
        );
      case Role.MEMBER:
        return (
          <Badge className="gap-1 bg-blue-500">
            <UserIcon className="h-3 w-3" />
            Member
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="gap-1">
            <UserIcon className="h-3 w-3" />
            Basic
          </Badge>
        );
    }
  };

  const getStatusBadge = (status: UserStatus) => {
    return status === UserStatus.ACTIVE ? (
      <Badge className="bg-accent">Active</Badge>
    ) : (
      <Badge variant="secondary">Inactive</Badge>
    );
  };

  if (isLoading) return <div>Loading users...</div>;
  if (isError) return <div>Error loading users: {error?.message}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="mb-2">Manage Users</h1>
        <p className="text-muted-foreground">
          View and manage all user accounts
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.total || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overviewStats?.activeUsers || 0} {/* Assuming overviewStats is available or fetched here */}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Premium Members</CardTitle>
            <Crown className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overviewStats?.premiumMembers || 0} {/* Assuming overviewStats is available or fetched here */}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Basic Members</CardTitle>
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overviewStats?.basicMembers || 0} {/* Assuming overviewStats is available or fetched here */}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                A list of all users in the system
              </CardDescription>
            </div>
            <div className="w-[300px]">
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Listings</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.profile_image} alt={user.name} />
                        <AvatarFallback>
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{user.listings_count}</TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Menu as="div" className="relative inline-block text-left">
                      <div>
                        <Menu.Button as={Button} variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Menu.Button>
                      </div>
                      <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="px-1 py-1 ">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={`${
                                  active ? 'bg-violet-500 text-white' : 'text-gray-900'
                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                              >
                                View Profile
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={`${
                                  active ? 'bg-violet-500 text-white' : 'text-gray-900'
                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                              >
                                View Listings
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                        <div className="px-1 py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setStatusDialogOpen(true);
                                }}
                                className={`${
                                  active ? 'bg-violet-500 text-white' : 'text-gray-900'
                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                              >
                                <Ban className="mr-2 h-4 w-4" />
                                {user.status === UserStatus.ACTIVE ? 'Deactivate' : 'Activate'}
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setRoleDialogOpen(true);
                                }}
                                className={`${
                                  active ? 'bg-violet-500 text-white' : 'text-gray-900'
                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                              >
                                <Shield className="mr-2 h-4 w-4" />
                                Change Role
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                        <div className="px-1 py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setDeleteDialogOpen(true);
                                }}
                                className={`${
                                  active ? 'bg-violet-500 text-white' : 'text-red-900'
                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
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
        </CardContent>
      </Card>

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

      {/* Status Dialog */}
      <AlertDialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedUser?.status === UserStatus.ACTIVE ? 'Deactivate' : 'Activate'} User
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {selectedUser?.status === UserStatus.ACTIVE ? 'deactivate' : 'activate'} {selectedUser?.name}?
              {selectedUser?.status === UserStatus.ACTIVE && ' This will prevent them from accessing their account.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => selectedUser && handleUpdateStatus(selectedUser.id, selectedUser.status)}>
              {selectedUser?.status === UserStatus.ACTIVE ? 'Deactivate' : 'Activate'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Role Dialog */}
      <AlertDialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change User Role</AlertDialogTitle>
            <AlertDialogDescription>
              Select a new role for {selectedUser?.name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <label htmlFor="role" className="text-right">Role</label>
              <select
                id="role"
                className="col-span-2 p-2 border rounded-md"
                value={selectedUser?.role || ''}
                onChange={(e) => {
                  if (selectedUser) {
                    setSelectedUser({ ...selectedUser, role: e.target.value as Role });
                  }
                }}
              >
                {Object.values(Role).map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => selectedUser && handleUpdateRole(selectedUser.id, selectedUser.role)}>
              Change Role
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete {selectedUser?.name}? This will also delete all their listings, events, and blog posts. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedUser && handleDelete(selectedUser.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

