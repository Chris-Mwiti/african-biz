import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';

export const AuthorizationGuard = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { role } = req.user;
    if (!allowedRoles.includes(role as Role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
};
