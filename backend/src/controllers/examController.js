const Exam = require('../models/Exam');

// @desc    Get all exams
// @route   GET /api/exams
// @access  Public
const getExams = async (req, res) => {
  try {
    // Advanced filtering
    const { degree, semester, subject, startDate, endDate } = req.query;
    const filter = {};

    // Add filters if provided
    if (degree) filter.degree = degree;
    if (semester) filter.semester = parseInt(semester);
    if (subject) filter.subject = subject;
    
    // Date range filtering
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const exams = await Exam.find(filter).sort({ date: 1 });
    res.status(200).json(exams);
  } catch (error) {
    console.error('Get exams error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get exam by ID
// @route   GET /api/exams/:id
// @access  Public
const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    
    res.status(200).json(exam);
  } catch (error) {
    console.error('Get exam by ID error:', error);
    
    // Check if error is due to invalid ID format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Exam not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new exam
// @route   POST /api/exams
// @access  Private (Admin only)
const createExam = async (req, res) => {
  try {
    const { 
      subject, 
      degree, 
      semester, 
      date, 
      startTime, 
      endTime, 
      location, 
      professor, 
      notes 
    } = req.body;

    // Create exam
    const exam = await Exam.create({
      subject,
      degree,
      semester,
      date,
      startTime,
      endTime,
      location,
      professor,
      notes
    });

    res.status(201).json(exam);
  } catch (error) {
    console.error('Create exam error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update exam
// @route   PUT /api/exams/:id
// @access  Private (Admin only)
const updateExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    
    const updatedExam = await Exam.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updatedExam);
  } catch (error) {
    console.error('Update exam error:', error);
    
    // Check if error is due to invalid ID format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Exam not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete exam
// @route   DELETE /api/exams/:id
// @access  Private (Admin only)
const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    
    await exam.deleteOne();
    
    res.status(200).json({ message: 'Exam removed' });
  } catch (error) {
    console.error('Delete exam error:', error);
    
    // Check if error is due to invalid ID format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Exam not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get unique filter options (degrees, semesters, subjects)
// @route   GET /api/exams/filters
// @access  Public
const getFilterOptions = async (req, res) => {
  try {
    // Get unique degrees
    const degrees = await Exam.distinct('degree');
    
    // Get unique semesters
    const semesters = await Exam.distinct('semester');
    
    // Get unique subjects
    const subjects = await Exam.distinct('subject');
    
    res.status(200).json({
      degrees,
      semesters: semesters.sort((a, b) => a - b), // Sort semesters numerically
      subjects: subjects.sort() // Sort subjects alphabetically
    });
  } catch (error) {
    console.error('Get filter options error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  getFilterOptions
}; 