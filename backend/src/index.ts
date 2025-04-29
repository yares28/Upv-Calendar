import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { dbConnection } from './database/connection';

// Import routes here
// import userRoutes from './routes/userRoutes';
// import calendarRoutes from './routes/calendarRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Health check endpoint for Docker
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
// app.use('/api/users', userRoutes);
// app.use('/api/calendar', calendarRoutes);

// Initialize database and start server
async function startServer() {
  try {
    // Initialize database connection
    await dbConnection.initialize();
    console.log('Database connection established');

    // Start express server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
}

startServer(); 