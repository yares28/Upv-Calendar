const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile,
  saveCalendar,
  deleteCalendar
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes - require authentication
router.get('/profile', protect, getUserProfile);
router.post('/calendar', protect, saveCalendar);
router.delete('/calendar/:id', protect, deleteCalendar);

module.exports = router; 