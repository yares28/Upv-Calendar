const jwt = require('jsonwebtoken');

/**
 * Generate a JWT token for authentication
 * @param {string} id - User ID to include in token payload
 * @returns {string} JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

module.exports = generateToken; 