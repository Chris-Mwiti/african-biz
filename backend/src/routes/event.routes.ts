import { Router } from 'express';
import { createEvent, getEvents, getEventById, updateEvent, deleteEvent } from '../controllers/event.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { validationMiddleware } from '../middleware/validation.middleware';
import { CreateEventDto, UpdateEventDto } from '../dto/event.dto';
import { OwnershipGuard } from '../guards/event.ownership.guard';
import { AuthorizationGuard } from '../guards/authorization.guard';

const router = Router();

router.route('/').post(authenticateToken, AuthorizationGuard(['PREMIUM', 'ADMIN']), validationMiddleware(CreateEventDto), createEvent).get(getEvents);

router
  .route('/:id')
  .get(getEventById)
  .put(authenticateToken, OwnershipGuard, validationMiddleware(UpdateEventDto), updateEvent)
  .delete(authenticateToken, OwnershipGuard, deleteEvent);

export default router;
