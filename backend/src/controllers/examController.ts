import { Request, Response } from 'express';
import { ExamService } from '../services/examService';

export class ExamController {
  private examService: ExamService;

  constructor() {
    this.examService = new ExamService();
}

/**
 * Get all exams
 * @route GET /api/exams
 * @access Public
 */
  getExams = async (req: Request, res: Response): Promise<void> => {
  try {
      // Parse query parameters
      const filters = {
        degree: req.query.degree as string | undefined,
        semester: req.query.semester ? parseInt(req.query.semester as string) : undefined,
        subject: req.query.subject as string | undefined,
        startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      };

      const exams = await this.examService.getExams(filters);
    res.status(200).json(exams);
  } catch (error) {
    console.error('Get exams error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get exam by ID
 * @route GET /api/exams/:id
 * @access Public
 */
  getExamById = async (req: Request, res: Response): Promise<void> => {
  try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid exam ID' });
        return;
      }
      
      const exam = await this.examService.getExamById(id);
    
    if (!exam) {
      res.status(404).json({ message: 'Exam not found' });
      return;
    }
    
    res.status(200).json(exam);
  } catch (error) {
    console.error('Get exam by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Create new exam
 * @route POST /api/exams
 * @access Private (Admin only)
 */
  createExam = async (req: Request, res: Response): Promise<void> => {
  try {
      const exam = await this.examService.createExam(req.body);
    res.status(201).json(exam);
  } catch (error) {
    console.error('Create exam error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update exam
 * @route PUT /api/exams/:id
 * @access Private (Admin only)
 */
  updateExam = async (req: Request, res: Response): Promise<void> => {
  try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid exam ID' });
        return;
      }
      
      const exam = await this.examService.updateExam(id, req.body);
    
    if (!exam) {
      res.status(404).json({ message: 'Exam not found' });
      return;
    }
    
      res.status(200).json(exam);
  } catch (error) {
    console.error('Update exam error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete exam
 * @route DELETE /api/exams/:id
 * @access Private (Admin only)
 */
  deleteExam = async (req: Request, res: Response): Promise<void> => {
  try {
      const id = parseInt(req.params.id);
    
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid exam ID' });
      return;
    }
    
      const success = await this.examService.deleteExam(id);
      
      if (!success) {
      res.status(404).json({ message: 'Exam not found' });
      return;
    }
    
      res.status(200).json({ message: 'Exam removed' });
    } catch (error) {
      console.error('Delete exam error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get unique filter options (degrees, semesters, subjects)
 * @route GET /api/exams/filters
 * @access Public
 */
  getFilterOptions = async (req: Request, res: Response): Promise<void> => {
  try {
      const filters = await this.examService.getFilterOptions();
      res.status(200).json(filters);
  } catch (error) {
    console.error('Get filter options error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 
} 