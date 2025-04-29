import mongoose, { Document, Schema } from 'mongoose';

// Interface for TypeScript type safety
export interface IExam extends Document {
  subject: string;
  degree: string;
  semester: number;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  professor?: string;
  notes?: string;
  createdAt: Date;
}

const examSchema = new Schema<IExam>({
  subject: {
    type: String,
    required: true,
    trim: true
  },
  degree: {
    type: String,
    required: true,
    trim: true
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  professor: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IExam>('Exam', examSchema); 