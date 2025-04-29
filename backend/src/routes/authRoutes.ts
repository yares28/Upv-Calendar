import express from 'express';
import { AuthController } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();
const authController = new AuthController();

// Public routes
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

// Protected routes
router.get('/profile', authMiddleware, authController.getUserProfile);
router.get('/calendars', authMiddleware, authController.getUserCalendars);
router.post('/calendars', authMiddleware, authController.saveCalendar);
router.delete('/calendars/:id', authMiddleware, authController.deleteCalendar);

export default router; 