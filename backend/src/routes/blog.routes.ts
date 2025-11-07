import { Router } from 'express';
import { createBlog, getBlogs, getBlogById, updateBlog, deleteBlog, getBlogsByUserId } from '../controllers/blog.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { validationMiddleware } from '../middleware/validation.middleware';
import { CreateBlogDto, UpdateBlogDto } from '../dto/blog.dto';
import { OwnershipGuard } from '../guards/blog.ownership.guard';
import { AuthorizationGuard } from '../guards/authorization.guard';

const router = Router();

router.route('/').post(authenticateToken, AuthorizationGuard(['PREMIUM', 'ADMIN']), validationMiddleware(CreateBlogDto), createBlog).get(getBlogs);
router.get('/me', authenticateToken, getBlogsByUserId);

router
  .route('/:id')
  .get(getBlogById)
  .put(authenticateToken, OwnershipGuard, validationMiddleware(UpdateBlogDto), updateBlog)
  .delete(authenticateToken, OwnershipGuard, deleteBlog);

export default router;
