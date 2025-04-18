// Import required packages
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Pool } from 'pg';

// Define interfaces for our data models
interface User {
  id: number;
  email: string;
  password: string;
  name?: string;
}

interface Calendar {
  id: number;
  user_id: number;
  name: string;
  filters?: {
    degrees?: string[];
    semesters?: number[];
    subjects?: string[];
  };
}

interface Exam {
  id: number;
  subject: string;
  date: string;
  time: string;
  location: string;
  degree: string;
  semester: number;
  notes?: string;
}

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Configure middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "upv_calendar",
  password: "postgres",
  port: 5432,
});

// Function to validate email format
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Basic middleware for logging requests
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to UPV Calendar API' });
});

// User registration
app.post('/api/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Insert new user
    const result = await pool.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id',
      [email, password, name || email.split('@')[0]]
    );

    // Return success with user id
    res.status(201).json({ 
      message: 'User registered successfully', 
      userId: result.rows[0].id 
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// User login
app.post('/api/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0] as User;

    // Check password
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Return user info
    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name || user.email.split('@')[0]
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get all calendars for a user
app.get('/api/calendars/:userId', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const result = await pool.query('SELECT * FROM calendars WHERE user_id = $1', [userId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching calendars:', error);
    res.status(500).json({ message: 'Server error while fetching calendars' });
  }
});

// Create a new calendar
app.post('/api/calendars', async (req: Request, res: Response) => {
  try {
    const { userId, name, filters } = req.body;

    if (!userId || !name) {
      return res.status(400).json({ message: 'User ID and calendar name are required' });
    }

    const result = await pool.query(
      'INSERT INTO calendars (user_id, name, filters) VALUES ($1, $2, $3) RETURNING *',
      [userId, name, filters ? JSON.stringify(filters) : null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating calendar:', error);
    res.status(500).json({ message: 'Server error while creating calendar' });
  }
});

// Update a calendar
app.put('/api/calendars/:id', async (req: Request, res: Response) => {
  try {
    const calendarId = parseInt(req.params.id);
    const { name, filters } = req.body;

    if (isNaN(calendarId)) {
      return res.status(400).json({ message: 'Invalid calendar ID' });
    }

    if (!name) {
      return res.status(400).json({ message: 'Calendar name is required' });
    }

    const result = await pool.query(
      'UPDATE calendars SET name = $1, filters = $2 WHERE id = $3 RETURNING *',
      [name, filters ? JSON.stringify(filters) : null, calendarId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Calendar not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating calendar:', error);
    res.status(500).json({ message: 'Server error while updating calendar' });
  }
});

// Delete a calendar
app.delete('/api/calendars/:id', async (req: Request, res: Response) => {
  try {
    const calendarId = parseInt(req.params.id);

    if (isNaN(calendarId)) {
      return res.status(400).json({ message: 'Invalid calendar ID' });
    }

    const result = await pool.query('DELETE FROM calendars WHERE id = $1 RETURNING *', [calendarId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Calendar not found' });
    }

    res.json({ message: 'Calendar deleted successfully' });
  } catch (error) {
    console.error('Error deleting calendar:', error);
    res.status(500).json({ message: 'Server error while deleting calendar' });
  }
});

// Get all exams
app.get('/api/exams', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM exams');
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching exams:', error);
    res.status(500).json({ message: 'Server error while fetching exams' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/* 
Note for production:
- Use environment variables for database credentials
- Implement proper password hashing (e.g., bcrypt)
- Add JWT for authentication
- Add rate limiting and CSRF protection
- Use HTTPS
*/ 