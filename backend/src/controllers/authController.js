const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password, // Password will be hashed by the pre-save middleware
      savedCalendars: []
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        savedCalendars: user.savedCalendars,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        savedCalendars: user.savedCalendars,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Save calendar
// @route   POST /api/auth/calendar
// @access  Private
const saveCalendar = async (req, res) => {
  try {
    const { name, filters } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Please provide a name for the calendar' });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create new calendar
    const newCalendar = {
      name,
      filters,
      createdAt: new Date()
    };

    user.savedCalendars.push(newCalendar);
    await user.save();

    res.status(201).json(user.savedCalendars);
  } catch (error) {
    console.error('Save calendar error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete calendar
// @route   DELETE /api/auth/calendar/:id
// @access  Private
const deleteCalendar = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find calendar by ID
    const calendarIndex = user.savedCalendars.findIndex(
      (cal) => cal._id.toString() === req.params.id
    );

    if (calendarIndex === -1) {
      return res.status(404).json({ message: 'Calendar not found' });
    }

    // Remove calendar from array
    user.savedCalendars.splice(calendarIndex, 1);
    await user.save();

    res.status(200).json(user.savedCalendars);
  } catch (error) {
    console.error('Delete calendar error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  saveCalendar,
  deleteCalendar
}; 