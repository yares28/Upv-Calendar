const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'upv_calendar',
  password: 'postgres', // Use your actual PostgreSQL password
  port: 5432,
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully:', res.rows[0].now);
  }
});

// Routes

// Authentication endpoints
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

// Calendar endpoints
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

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

/*
To run this server:
1. Install required packages:
   npm install express pg cors body-parser

2. Make sure PostgreSQL is running and the database is set up using the database_setup.sql script.

3. Start the server:
   node server.js

This is a simple demonstration server. In a production environment, you would want to:
- Use environment variables for database credentials
- Implement proper JWT authentication
- Add input validation
- Hash passwords
- Add error handling middleware
- Use a more robust project structure
*/ 