const express = require('express');
const router = express.Router();
const {
  getExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  getFilterOptions
} = require('../controllers/examController');
const { protect } = require('../middleware/authMiddleware');

// Get filter options (degrees, semesters, subjects)
router.get('/filters', getFilterOptions);

// Public exam routes
router.get('/', getExams);
router.get('/:id', getExamById);

// Protected admin routes
// In a real app, you would add an admin middleware check here
router.post('/', protect, createExam);
router.put('/:id', protect, updateExam);
router.delete('/:id', protect, deleteExam);

module.exports = router; 