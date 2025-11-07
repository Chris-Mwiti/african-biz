import { useGetMyListings } from '../../services/listing.service';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Link } from 'react-router-dom';

export function MyListings() {
  const { data: listings, isLoading, error } = useGetMyListings();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching listings</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Listings</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings?.map((listing) => (
              <TableRow key={listing.id}>
                <TableCell>{listing.title}</TableCell>
                <TableCell>{listing.category.name}</TableCell>
                <TableCell>{listing.status}</TableCell>
                <TableCell>
                  <Link to={`/dashboard/edit-listing/${listing.id}`}>
                    <Button variant="outline" size="sm">Edit</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
