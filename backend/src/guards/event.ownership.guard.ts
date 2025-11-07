import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';

export const OwnershipGuard = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  const userRole = req.user?.role;

  if (userRole === 'ADMIN') {
    return next();
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id },
      select: { creator_id: true },
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.creator_id !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking ownership' });
  }
};
