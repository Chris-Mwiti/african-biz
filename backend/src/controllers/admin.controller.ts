import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { Role, ApprovalStatus,ListingStatus, UserStatus  } from '@prisma/client'; // UserStatus added

// Get Admin Dashboard Overview Stats
export const getAdminOverviewStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const activeUsers = await prisma.user.count({where: {status: UserStatus.ACTIVE}});
    const premiumMembers = await prisma.user.count({ where: { role: Role.PREMIUM } });
    const basicMembers = await prisma.user.count({ where: { role: Role.MEMBER } }); // Assuming 'MEMBER' is basic
     const totalListings = await prisma.listing.count();
    const pendingListings = await prisma.listing.count({ where: { status: ListingStatus.PENDING } });
    const premiumListings = await prisma.listing.count({ where: { is_premium: true } });
    const verifiedListings = await prisma.listing.count({ where: { verified: true } });

    // Placeholder for monthly revenue - needs actual payment integration
    //const monthlyRevenue = await prisma.subscription.aggregate({
     // _sum: {
      //  amount: true
      //}    
    //}); // TODO: Implement actual revenue calculation
    const monthlyRevenue = 0

    res.json({
      totalUsers,
      activeUsers,
      premiumMembers,
      basicMembers,
      totalListings,
      pendingListings,
      premiumListings,
      verifiedListings,
      monthlyRevenue,
    });
  } catch (error) {
    console.error("analytics error: ", error)
    res.status(500).json({ message: 'Error fetching admin overview stats', error });
  }
};

// Get Recent Activity (Placeholder - needs detailed implementation based on audit logs)
export const getRecentActivity = async (req: Request, res: Response) => {
  try {
    // This would typically query an audit log or recent activity table
    // For now, return mock data or a simplified version
    const recentActivities: any[] = [
      // Example: Fetch last 5 created listings, events, blogs
    ];
    res.json(recentActivities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recent activity', error });
  }
};

// Get Top Categories
export const getTopCategories = async (req: Request, res: Response) => {
  try {
    const topCategories = await prisma.category.findMany({
      include: {
        _count: {
          select: { listings: true },
        },
      },
      orderBy: {
        listings: {
          _count: 'desc',
        },
      },
      take: 5, // Top 5 categories
    });

    res.json(topCategories.map(cat => ({
      id: cat.id,
      name: cat.name,
      listingCount: cat._count.listings,
    })));
  } catch (error) {
    console.error("error while fetching top categories: ", error)
    res.status(500).json({ message: 'Error fetching top categories', error });
  }
};

// Manage Users
export const getAdminUsers = async (req: Request, res: Response) => {
  const { search, role, status, page = 1, pageSize = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

  const where: any = {};
  if (search) {
    where.OR = [
      { name: { contains: search as string, mode: 'insensitive' } },
      { email: { contains: search as string, mode: 'insensitive' } },
    ];
  }
  if (role) {
    where.role = role as Role;
  }
  if (status) {
    where.status = status;
  }

  try {
    const users = await prisma.user.findMany({
      where,
      skip,
      take,
      include: {
        _count: {
          select: { listings: true },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
    const total = await prisma.user.count({ where });

    res.json({
      users: users.map(user => ({
        ...user,
        listings_count: user._count.listings,
      })),
      total,
      page: Number(page),
      pageSize: Number(pageSize),
      totalPages: Math.ceil(total / Number(pageSize)),
    });
  } catch (error) {
    console.error("error while fetching users: ", error)
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

export const updateUserStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body; // Expects { status: 'ACTIVE' | 'INACTIVE' | 'BANNED' }

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { status: status },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user status', error });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body; // Expects { role: 'MEMBER' | 'PREMIUM' | 'ADMIN' }

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user role', error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // Consider soft delete or ensure cascade deletes are handled by Prisma
    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};

// Manage Listings (Pending Approvals)
export const getPendingListings = async (req: Request, res: Response) => {
  const { page = 1, pageSize = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

  try {
    const listings = await prisma.listing.findMany({
      where: { status: ListingStatus.PENDING },
      skip,
      take,
      include: {
        category: true,
        owner: true,
      },
      orderBy: {
        created_at: 'asc',
      },
    });
    const total = await prisma.listing.count({ where: { status: ListingStatus.PENDING } });

    res.json({
      listings: listings.map(listing => ({
        ...listing,
        owner_name: listing.owner.name,
        category_name: listing.category.name,
      })),
      total,
      page: Number(page),
      pageSize: Number(pageSize),
      totalPages: Math.ceil(total / Number(pageSize)),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending listings', error });
  }
};

export const approveListing = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedListing = await prisma.listing.update({
      where: { id },
      data: { status: ListingStatus.ACTIVE },
    });
    res.json(updatedListing);
  } catch (error) {
    res.status(500).json({ message: 'Error approving listing', error });
  }
};

export const rejectListing = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedListing = await prisma.listing.update({
      where: { id },
      data: { status: ListingStatus.REJECTED },
    });
    res.json(updatedListing);
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting listing', error });
  }
};

export const getAdminListings = async (req: Request, res: Response) => {
  const { search, status, is_premium, page = 1, pageSize = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

  const where: any = {};
  if (search) {
    where.OR = [
      { title: { contains: search as string, mode: 'insensitive' } },
      { description: { contains: search as string, mode: 'insensitive' } },
    ];
  }
  if (status) {
    where.status = status as ListingStatus;
  }
  if (is_premium) {
    where.is_premium = is_premium === 'true';
  }

  try {
    const listings = await prisma.listing.findMany({
      where,
      skip,
      take,
      include: {
        category: true,
        owner: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
    const total = await prisma.listing.count({ where });

    res.json({
      listings: listings.map(listing => ({
        ...listing,
        owner_name: listing.owner.name,
        category_name: listing.category.name,
      })),
      total,
      page: Number(page),
      pageSize: Number(pageSize),
      totalPages: Math.ceil(total / Number(pageSize)),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching listings', error });
  }
}

export const upgradeListingToPremium = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedListing = await prisma.listing.update({
      where: { id },
      data: { is_premium: true },
    });
    res.json(updatedListing);
  } catch (error) {
    res.status(500).json({ message: 'Error upgrading listing to premium', error });
  }
}

export const updateListing = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...data } = req.body;
  try {
    const updatedListing = await prisma.listing.update({
      where: { id },
      data,
    });
    res.json(updatedListing);
  } catch (error) {
    res.status(500).json({ message: 'Error updating listing', error });
  }
}

export const deleteListing = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.listing.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting listing', error });
  }
}
