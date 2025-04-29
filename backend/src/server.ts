import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config as dotenvConfig } from 'dotenv';
import { initializeDB } from './db/config';

// Import routes
import authRoutes from './routes/authRoutes';
import examRoutes from './routes/examRoutes';

// Load environment variables
dotenvConfig();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'UPV Calendar API Server Running' });
});

// Error handler middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start the server
const startServer = async (): Promise<void> => {
  try {
    // Initialize database connection
    await initializeDB();
    
    // Start the Express server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
};

// Start the server
startServer(); 