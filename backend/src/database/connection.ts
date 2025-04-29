import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database configuration from environment variables
const {
  DB_HOST = 'localhost',
  DB_PORT = '5432',
  DB_USER = 'postgres',
  DB_PASSWORD = 'postgres',
  DB_NAME = 'upvcal',
} = process.env;

// Create and export the database connection
export const dbConnection = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: parseInt(DB_PORT, 10),
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: false, // Set to false in production
  logging: process.env.NODE_ENV !== 'production',
  entities: [],  // Add your entity paths here
  subscribers: [],
  migrations: [],
}); 