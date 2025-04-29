import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Exam, { IExam } from '../models/Exam';

// Load env vars (adjust path relative to the location of this file)
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/upv_calendar');

// Sample exam data
const exams = [
  {
    subject: 'Mathematics I',
    degree: 'Computer Science',
    semester: 1,
    date: new Date('2024-06-10'),
    startTime: '09:00',
    endTime: '11:00',
    location: 'Room A-101',
    professor: 'Dr. Smith',
    notes: 'Bring calculator and formula sheet'
  },
  {
    subject: 'Programming Fundamentals',
    degree: 'Computer Science',
    semester: 1,
    date: new Date('2024-06-12'),
    startTime: '10:00',
    endTime: '12:00',
    location: 'Computer Lab B-201',
    professor: 'Dr. Johnson',
    notes: 'Practical exam, no books allowed'
  },
  {
    subject: 'Physics I',
    degree: 'Computer Science',
    semester: 1,
    date: new Date('2024-06-15'),
    startTime: '11:00',
    endTime: '13:00',
    location: 'Room A-102',
    professor: 'Dr. Garcia',
    notes: 'Multiple choice and problem solving'
  },
  {
    subject: 'English',
    degree: 'Computer Science',
    semester: 1,
    date: new Date('2024-06-18'),
    startTime: '14:00',
    endTime: '16:00',
    location: 'Room A-103',
    professor: 'Dr. Wilson',
    notes: 'Writing and listening test'
  },
  {
    subject: 'Programming Fundamentals',
    degree: 'Telecommunications',
    semester: 1,
    date: new Date('2024-06-14'),
    startTime: '09:30',
    endTime: '11:30',
    location: 'Computer Lab B-202',
    professor: 'Dr. Johnson',
    notes: 'Practical exam, no books allowed'
  },
  {
    subject: 'Mathematics II',
    degree: 'Computer Science',
    semester: 2,
    date: new Date('2024-06-20'),
    startTime: '09:00',
    endTime: '11:00',
    location: 'Room A-201',
    professor: 'Dr. Smith',
    notes: 'Bring calculator and formula sheet'
  },
  {
    subject: 'Data Structures',
    degree: 'Computer Science',
    semester: 2,
    date: new Date('2024-06-22'),
    startTime: '10:00',
    endTime: '12:00',
    location: 'Computer Lab B-203',
    professor: 'Dr. Brown',
    notes: 'Practical and theoretical components'
  },
  {
    subject: 'Databases',
    degree: 'Computer Science',
    semester: 3,
    date: new Date('2024-06-24'),
    startTime: '09:00',
    endTime: '11:00',
    location: 'Computer Lab B-204',
    professor: 'Dr. Lee',
    notes: 'SQL and database design'
  },
  {
    subject: 'Software Engineering',
    degree: 'Computer Science',
    semester: 3,
    date: new Date('2024-06-26'),
    startTime: '11:00',
    endTime: '13:00',
    location: 'Room A-204',
    professor: 'Dr. Martinez',
    notes: 'Group project presentation'
  },
  {
    subject: 'Computer Networks',
    degree: 'Telecommunications',
    semester: 3,
    date: new Date('2024-06-28'),
    startTime: '14:00',
    endTime: '16:00',
    location: 'Lab C-101',
    professor: 'Dr. Rodriguez',
    notes: 'Network configuration practical'
  }
];

/**
 * Import sample data to database
 */
const importData = async (): Promise<void> => {
  try {
    // Clear existing data
    await Exam.deleteMany({});
    console.log('Data cleared...');

    // Insert sample exams
    await Exam.insertMany(exams);
    console.log('Data imported successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
};

/**
 * Delete all data from the database
 */
const deleteData = async (): Promise<void> => {
  try {
    await Exam.deleteMany({});
    console.log('Data destroyed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
};

// Check command line argument and execute appropriate function
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please use correct command:');
  console.log('  ts-node seeder.ts -i  (to import data)');
  console.log('  ts-node seeder.ts -d  (to delete data)');
  process.exit(0);
} 