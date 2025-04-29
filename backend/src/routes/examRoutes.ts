import express from 'express';
import { ExamController } from '../controllers/examController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();
const examController = new ExamController();

// Get filter options (degrees, semesters, subjects)
router.get('/filters', examController.getFilterOptions);

// Public exam routes
router.get('/', examController.getExams);
router.get('/:id', examController.getExamById);

// Protected admin routes
router.post('/', authMiddleware, examController.createExam);
router.put('/:id', authMiddleware, examController.updateExam);
router.delete('/:id', authMiddleware, examController.deleteExam);

export default router; 