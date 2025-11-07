import { Router } from 'express';
import { trackAnalyticEvent, getListingAnalytics, getUserListingsAnalytics } from '../controllers/analytic.controller';
import { AuthenticationGuard } from '../guards/authentication.guard';
import { validationMiddleware } from '../middleware/validation.middleware';
import { TrackAnalyticEventDto } from '../dto/analytic.dto';

const router = Router();

// Public endpoint for tracking events (e.g., views can be tracked without login)
router.post('/track', validationMiddleware(TrackAnalyticEventDto), trackAnalyticEvent);

// Protected endpoints for fetching analytics (requires authentication)
router.use(AuthenticationGuard);
router.get('/:id', getListingAnalytics); // Get analytics for a specific listing (owner only)
router.get('/', getUserListingsAnalytics); // Get analytics for all user's listings

export default router;
