import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interfaces for TypeScript type safety
export interface IFilter {
  degrees: string[];
  semesters: string[];
  subjects: string[];
}

export interface ICalendar {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  filters: IFilter;
  createdAt: Date;
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  savedCalendars: ICalendar[];
  createdAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

// Calendar filter schema
const filterSchema = new Schema<IFilter>({
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
const calendarSchema = new Schema<ICalendar>({
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
const userSchema = new Schema<IUser>({
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
    next(error as Error);
  }
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema); 