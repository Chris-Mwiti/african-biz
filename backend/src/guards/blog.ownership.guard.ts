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
    const blog = await prisma.blog.findUnique({
      where: { id },
      select: { author_id: true },
    });

    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    if (blog.author_id !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking ownership' });
  }
};
