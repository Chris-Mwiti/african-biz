import { Router } from 'express';
import { signup, login, getMe, updatePassword, deleteMe, googleCallback } from '../controllers/auth.controller';
import { AuthenticationGuard } from '../guards/authentication.guard';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/google/callback', googleCallback);

router.get('/me', AuthenticationGuard, getMe);
router.put('/password', AuthenticationGuard, updatePassword);
router.delete('/me', AuthenticationGuard, deleteMe);

export default router;
