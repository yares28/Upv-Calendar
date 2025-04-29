import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../db/config';
import { User } from '../db/models';

// Extend the Request interface to include the user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

/**
 * Interface for JWT payload
 */
interface JwtPayload {
  id: number;
  iat: number;
  exp: number;
}

/**
 * Middleware to protect routes
 * Verifies the JWT token and adds the user to the request object
 */
export const authMiddleware = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  // Check if authorization header exists and starts with Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (format: "Bearer token")
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const secret = process.env.JWT_SECRET || 'defaultsecret';
      const decoded = jwt.verify(token, secret) as JwtPayload;

      // Get user from the token (exclude password)
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ 
        where: { id: decoded.id },
        select: { password: false }
      });

      if (!user) {
        res.status(401).json({ message: 'Not authorized, user not found' });
        return;
      }

      // Assign to req.user
      req.user = user;

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
      return;
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
    return;
  }
}; 