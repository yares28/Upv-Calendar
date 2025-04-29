import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

/**
 * Generate a JWT token for authentication
 * @param {string | Types.ObjectId} id - User ID to include in token payload
 * @returns {string} JWT token
 */
const generateToken = (id: string | Types.ObjectId): string => {
  const secret = process.env.JWT_SECRET || 'defaultsecret';
  
  return jwt.sign({ id }, secret, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

export default generateToken; 