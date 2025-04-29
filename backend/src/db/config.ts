import { DataSource } from 'typeorm';
import { User, Calendar, Degree, Subject, Place, Exam, ExamSchedule } from './models';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database configuration
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.PG_HOST || 'localhost',
  port: parseInt(process.env.PG_PORT || '5432'),
  username: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || 'postgres',
  database: process.env.PG_DATABASE || 'upv_calendar',
  synchronize: false, // Set to false in production
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Calendar, Degree, Subject, Place, Exam, ExamSchedule],
  migrations: ['src/db/migrations/**/*.ts'],
  subscribers: [],
});

// Initialize connection function
export const initializeDB = async (): Promise<DataSource> => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('Database connection established');
    }
    return AppDataSource;
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
}; 