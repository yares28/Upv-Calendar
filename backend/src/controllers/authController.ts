import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
}

/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
  registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: 'Please add all fields' });
      return;
    }

      const user = await this.authService.registerUser({ name, email, password });

      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        token: this.generateToken(user.id)
      });
  } catch (error) {
    console.error('Register error:', error);
      
      if (error instanceof Error && error.message === 'User already exists') {
        res.status(400).json({ message: error.message });
        return;
      }
      
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Authenticate a user
 * @route POST /api/auth/login
 * @access Public
 */
  loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: 'Please add all fields' });
        return;
      }

      const { user, token } = await this.authService.loginUser(email, password);

      res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        token
      });
  } catch (error) {
    console.error('Login error:', error);
      
      if (error instanceof Error && error.message === 'Invalid credentials') {
        res.status(401).json({ message: error.message });
        return;
      }
      
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get user profile
 * @route GET /api/auth/profile
 * @access Private
 */
  getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
      if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

      const user = await this.authService.getUserById(req.user.id);
    
      if (!user) {
      res.status(404).json({ message: 'User not found' });
        return;
      }

      res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        calendars: user.calendars
      });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Save calendar
   * @route POST /api/auth/calendars
 * @access Private
 */
  saveCalendar = async (req: Request, res: Response): Promise<void> => {
  try {
      if (!req.user) {
        res.status(401).json({ message: 'Not authorized' });
        return;
      }

      const { name, description, filters } = req.body;
    
    if (!name) {
      res.status(400).json({ message: 'Please provide a name for the calendar' });
      return;
    }

      const calendar = await this.authService.saveCalendar(
        req.user.id,
        name,
        description,
        filters
      );

      res.status(201).json(calendar);
    } catch (error) {
      console.error('Save calendar error:', error);

      if (error instanceof Error && error.message === 'User not found') {
        res.status(404).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete calendar
   * @route DELETE /api/auth/calendars/:id
 * @access Private
 */
  deleteCalendar = async (req: Request, res: Response): Promise<void> => {
  try {
      if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

      const calendarId = parseInt(req.params.id);

      if (isNaN(calendarId)) {
        res.status(400).json({ message: 'Invalid calendar ID' });
      return;
    }

      const success = await this.authService.deleteCalendar(req.user.id, calendarId);

      if (!success) {
      res.status(404).json({ message: 'Calendar not found' });
      return;
    }

      const calendars = await this.authService.getUserCalendars(req.user.id);
      res.status(200).json(calendars);
  } catch (error) {
    console.error('Delete calendar error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
   * Get user calendars
   * @route GET /api/auth/calendars
 * @access Private
 */
  getUserCalendars = async (req: Request, res: Response): Promise<void> => {
  try {
      if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

      const calendars = await this.authService.getUserCalendars(req.user.id);
      res.status(200).json(calendars);
  } catch (error) {
      console.error('Get calendars error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 

  /**
   * Generate JWT token (helper method)
   */
  private generateToken(userId: number): string {
    const jwt = require('jsonwebtoken');
    const secret = process.env.JWT_SECRET || 'defaultsecret';
    return jwt.sign({ id: userId }, secret, { expiresIn: '30d' });
  }
} 