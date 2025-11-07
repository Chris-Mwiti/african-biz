import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';

export const OwnershipGuard = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const listing = await prisma.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.owner_id !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking ownership' });
  }
};
