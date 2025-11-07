import { Router } from 'express';
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller';
import { AuthenticationGuard } from '../guards/authentication.guard';
import { AuthorizationGuard } from '../guards/authorization.guard';
import { Role } from '@prisma/client';
import { validationMiddleware } from '../middleware/validation.middleware';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';

const router = Router();

// Routes for all users (e.g., fetching categories for display)
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Routes for Admin only
router.use(AuthenticationGuard);
router.use(AuthorizationGuard([Role.ADMIN]));

router.post('/', validationMiddleware(CreateCategoryDto), createCategory);
router.put('/:id', validationMiddleware(UpdateCategoryDto), updateCategory);
router.delete('/:id', deleteCategory);

export default router;
