import { Router } from 'express';
import { createListing, getListings, getListingById, updateListing, deleteListing, getPublicListings, searchListings } from '../controllers/listing.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { validationMiddleware } from '../middleware/validation.middleware';
import { CreateListingDto, UpdateListingDto } from '../dto/listing.dto';
import { OwnershipGuard } from '../guards/ownership.guard';

const router = Router();

router.route('/').post(authenticateToken, validationMiddleware(CreateListingDto), createListing).get(authenticateToken, getListings);
router.route('/public').get(getPublicListings); // Public route for all approved listings
router.route('/search').get(searchListings);
router
  .route('/:id')
  .get(getListingById)
  .put(authenticateToken, OwnershipGuard, validationMiddleware(UpdateListingDto), updateListing)
  .delete(authenticateToken, OwnershipGuard, deleteListing);

export default router;
