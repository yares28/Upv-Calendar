const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Calendar filter schema
const filterSchema = new mongoose.Schema({
  degrees: {
    type: [String],
    default: []
  },
  semesters: {
    type: [String],
    default: []
  },
  subjects: {
    type: [String],
    default: []
  }
}, { _id: false });

// Calendar schema (as subdocument)
const calendarSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  filters: {
    type: filterSchema,
    default: () => ({})
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { _id: true });

// User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  savedCalendars: [calendarSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    // Hash password
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema); 