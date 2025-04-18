const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL Database connection
const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'upv_calendar',
  password: process.env.PG_PASSWORD || 'postgres',
  port: process.env.PG_PORT || 5432,
});

// Test PostgreSQL connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('PostgreSQL connection error:', err);
  } else {
    console.log('PostgreSQL connected successfully:', res.rows[0].now);
  }
});

// MongoDB Connection
const connectMongoDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/upv_calendar';
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

// Connect to MongoDB
connectMongoDB();

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const examRoutes = require('./src/routes/examRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);

// Legacy PostgreSQL-based routes
// These will gradually be replaced by MongoDB-based routes

// Authentication endpoints (legacy)
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // In a real app, you would hash the password and compare with the stored hash
    const result = await pool.query(
      'SELECT id, email, first_name, last_name FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // In a real app, you would generate a JWT token here
    res.json({
      success: true,
      user: result.rows[0],
      token: 'sample-jwt-token' // This would be a real JWT in production
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    // In a real app, you would hash the password before storing it
    const result = await pool.query(
      'INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id, email, first_name, last_name',
      [email, password, firstName, lastName]
    );
    
    // In a real app, you would generate a JWT token here
    res.status(201).json({
      success: true,
      user: result.rows[0],
      token: 'sample-jwt-token' // This would be a real JWT in production
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Calendar endpoints (legacy)
app.get('/api/calendars', async (req, res) => {
  try {
    const userId = req.query.userId; // In a real app, you would get this from JWT token
    
    if (!userId) {
      return res.status(401).json({ message: 'User ID required' });
    }
    
    const result = await pool.query(
      'SELECT * FROM saved_calendars WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get calendars error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/calendars', async (req, res) => {
  try {
    const { userId, name, degrees, semesters, subjects } = req.body;
    
    // In a real app, you would validate the JWT token and get user ID from it
    if (!userId) {
      return res.status(401).json({ message: 'User ID required' });
    }
    
    const result = await pool.query(
      'INSERT INTO saved_calendars (user_id, name, degrees, semesters, subjects) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, name, degrees, semesters, subjects]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Save calendar error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/calendars/:id', async (req, res) => {
  try {
    const calendarId = req.params.id;
    const userId = req.query.userId; // In a real app, you would get this from JWT token
    
    if (!userId) {
      return res.status(401).json({ message: 'User ID required' });
    }
    
    const result = await pool.query(
      'SELECT * FROM saved_calendars WHERE id = $1 AND user_id = $2',
      [calendarId, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Calendar not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get calendar error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/calendars/:id', async (req, res) => {
  try {
    const calendarId = req.params.id;
    const userId = req.query.userId; // In a real app, you would get this from JWT token
    
    if (!userId) {
      return res.status(401).json({ message: 'User ID required' });
    }
    
    const result = await pool.query(
      'DELETE FROM saved_calendars WHERE id = $1 AND user_id = $2 RETURNING id',
      [calendarId, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Calendar not found' });
    }
    
    res.json({ success: true, message: 'Calendar deleted' });
  } catch (error) {
    console.error('Delete calendar error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

/*
To run this server:
1. Install required packages:
   npm install express pg cors body-parser mongoose dotenv bcryptjs jsonwebtoken

2. Create a .env file with your environment variables:
   PORT=3000
   PG_USER=postgres
   PG_HOST=localhost
   PG_DATABASE=upv_calendar
   PG_PASSWORD=postgres
   PG_PORT=5432
   MONGO_URI=mongodb://localhost:27017/upv_calendar
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development

3. Make sure PostgreSQL and MongoDB are running.

4. Start the server:
   node server.js
*/ 