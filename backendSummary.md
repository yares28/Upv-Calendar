This file is a merged representation of a subset of the codebase, containing specifically included files, combined into a single document by Repomix.
The content has been processed where line numbers have been added, content has been formatted for parsing in markdown style, security check has been disabled.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Only files matching these patterns are included: backend
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Line numbers have been added to the beginning of each line
- Content has been formatted for parsing in markdown style
- Security check has been disabled - content may contain sensitive information
- Files are sorted by Git change count (files with more changes are at the bottom)

## Additional Info

# Directory Structure
```
backend/
  src/
    config/
      database.js
    controllers/
      authController.ts
      examController.ts
    middleware/
      authMiddleware.ts
    middlewares/
      authMiddleware.js
    models/
      Exam.ts
      User.ts
    routes/
      authRoutes.ts
      examRoutes.ts
    utils/
      generateToken.ts
      seeder.ts
    server.ts
  import_exam_data.ts
  package.json
  seed-db.bat
  server.ts
  tsconfig.json
```

# Files

## File: backend/src/config/database.js
```javascript
 1: const mongoose = require('mongoose');
 2: 
 3: // Database connection function
 4: const connectDB = async () => {
 5:   try {
 6:     const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/upv-cal', {
 7:       useNewUrlParser: true,
 8:       useUnifiedTopology: true,
 9:     });
10:     
11:     console.log(`MongoDB Connected: ${conn.connection.host}`);
12:   } catch (error) {
13:     console.error(`Error: ${error.message}`);
14:     process.exit(1);
15:   }
16: };
17: 
18: module.exports = connectDB;
```

## File: backend/src/controllers/authController.ts
```typescript
  1: import { Request, Response } from 'express';
  2: import User, { IUser } from '../models/User';
  3: import generateToken from '../utils/generateToken';
  4: 
  5: // Define custom request type with user property
  6: interface AuthRequest extends Request {
  7:   user?: IUser;
  8: }
  9: 
 10: /**
 11:  * Register a new user
 12:  * @route POST /api/auth/register
 13:  * @access Public
 14:  */
 15: export const registerUser = async (req: Request, res: Response): Promise<void> => {
 16:   try {
 17:     const { name, email, password } = req.body;
 18: 
 19:     if (!name || !email || !password) {
 20:       res.status(400).json({ message: 'Please add all fields' });
 21:       return;
 22:     }
 23: 
 24:     // Check if user exists
 25:     const userExists = await User.findOne({ email });
 26: 
 27:     if (userExists) {
 28:       res.status(400).json({ message: 'User already exists' });
 29:       return;
 30:     }
 31: 
 32:     // Create user
 33:     const user = await User.create({
 34:       name,
 35:       email,
 36:       password, // Password will be hashed by the pre-save middleware
 37:       savedCalendars: []
 38:     });
 39: 
 40:     if (user) {
 41:       res.status(201).json({
 42:         _id: user._id,
 43:         name: user.name,
 44:         email: user.email,
 45:         savedCalendars: user.savedCalendars,
 46:         token: generateToken(user._id),
 47:       });
 48:     } else {
 49:       res.status(400).json({ message: 'Invalid user data' });
 50:     }
 51:   } catch (error) {
 52:     console.error('Register error:', error);
 53:     res.status(500).json({ message: 'Server error' });
 54:   }
 55: };
 56: 
 57: /**
 58:  * Authenticate a user
 59:  * @route POST /api/auth/login
 60:  * @access Public
 61:  */
 62: export const loginUser = async (req: Request, res: Response): Promise<void> => {
 63:   try {
 64:     const { email, password } = req.body;
 65: 
 66:     // Check for user email
 67:     const user = await User.findOne({ email });
 68: 
 69:     if (user && (await user.matchPassword(password))) {
 70:       res.json({
 71:         _id: user._id,
 72:         name: user.name,
 73:         email: user.email,
 74:         savedCalendars: user.savedCalendars,
 75:         token: generateToken(user._id),
 76:       });
 77:     } else {
 78:       res.status(400).json({ message: 'Invalid credentials' });
 79:     }
 80:   } catch (error) {
 81:     console.error('Login error:', error);
 82:     res.status(500).json({ message: 'Server error' });
 83:   }
 84: };
 85: 
 86: /**
 87:  * Get user profile
 88:  * @route GET /api/auth/profile
 89:  * @access Private
 90:  */
 91: export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
 92:   try {
 93:     if (!req.user?._id) {
 94:       res.status(401).json({ message: 'Not authorized' });
 95:       return;
 96:     }
 97: 
 98:     const user = await User.findById(req.user._id).select('-password');
 99:     
100:     if (user) {
101:       res.json(user);
102:     } else {
103:       res.status(404).json({ message: 'User not found' });
104:     }
105:   } catch (error) {
106:     console.error('Get profile error:', error);
107:     res.status(500).json({ message: 'Server error' });
108:   }
109: };
110: 
111: /**
112:  * Save calendar
113:  * @route POST /api/auth/calendar
114:  * @access Private
115:  */
116: export const saveCalendar = async (req: AuthRequest, res: Response): Promise<void> => {
117:   try {
118:     const { name, filters } = req.body;
119:     
120:     if (!name) {
121:       res.status(400).json({ message: 'Please provide a name for the calendar' });
122:       return;
123:     }
124: 
125:     if (!req.user?._id) {
126:       res.status(401).json({ message: 'Not authorized' });
127:       return;
128:     }
129: 
130:     const user = await User.findById(req.user._id);
131: 
132:     if (!user) {
133:       res.status(404).json({ message: 'User not found' });
134:       return;
135:     }
136: 
137:     // Create new calendar
138:     const newCalendar = {
139:       name,
140:       description: '',
141:       filters,
142:       createdAt: new Date()
143:     };
144: 
145:     user.savedCalendars.push(newCalendar as any); // Type assertion as mongoose will handle the _id
146:     await user.save();
147: 
148:     res.status(201).json(user.savedCalendars);
149:   } catch (error) {
150:     console.error('Save calendar error:', error);
151:     res.status(500).json({ message: 'Server error' });
152:   }
153: };
154: 
155: /**
156:  * Delete calendar
157:  * @route DELETE /api/auth/calendar/:id
158:  * @access Private
159:  */
160: export const deleteCalendar = async (req: AuthRequest, res: Response): Promise<void> => {
161:   try {
162:     if (!req.user?._id) {
163:       res.status(401).json({ message: 'Not authorized' });
164:       return;
165:     }
166: 
167:     const user = await User.findById(req.user._id);
168: 
169:     if (!user) {
170:       res.status(404).json({ message: 'User not found' });
171:       return;
172:     }
173: 
174:     // Find calendar by ID
175:     const calendarIndex = user.savedCalendars.findIndex(
176:       (cal) => cal._id.toString() === req.params.id
177:     );
178: 
179:     if (calendarIndex === -1) {
180:       res.status(404).json({ message: 'Calendar not found' });
181:       return;
182:     }
183: 
184:     // Remove calendar from array
185:     user.savedCalendars.splice(calendarIndex, 1);
186:     await user.save();
187: 
188:     res.status(200).json(user.savedCalendars);
189:   } catch (error) {
190:     console.error('Delete calendar error:', error);
191:     res.status(500).json({ message: 'Server error' });
192:   }
193: };
194: 
195: /**
196:  * Refresh JWT token
197:  * @route POST /api/auth/refresh
198:  * @access Private
199:  */
200: export const refreshToken = async (req: AuthRequest, res: Response): Promise<void> => {
201:   try {
202:     if (!req.user?._id) {
203:       res.status(401).json({ message: 'Not authorized' });
204:       return;
205:     }
206: 
207:     // User is already authenticated by the middleware, so we can just generate a new token
208:     const token = generateToken(req.user._id);
209: 
210:     // Return the new token
211:     res.json({ token });
212:   } catch (error) {
213:     console.error('Token refresh error:', error);
214:     res.status(500).json({ message: 'Server error' });
215:   }
216: };
```

## File: backend/src/controllers/examController.ts
```typescript
  1: import { Request, Response } from 'express';
  2: import Exam, { IExam } from '../models/Exam';
  3: import mongoose from 'mongoose';
  4: 
  5: interface ExamFilters {
  6:   degree?: string;
  7:   semester?: number;
  8:   subject?: string;
  9:   date?: {
 10:     $gte?: Date;
 11:     $lte?: Date;
 12:   };
 13: }
 14: 
 15: /**
 16:  * Get all exams
 17:  * @route GET /api/exams
 18:  * @access Public
 19:  */
 20: export const getExams = async (req: Request, res: Response): Promise<void> => {
 21:   try {
 22:     // Advanced filtering
 23:     const { degree, semester, subject, startDate, endDate } = req.query;
 24:     const filter: ExamFilters = {};
 25: 
 26:     // Add filters if provided
 27:     if (degree) filter.degree = degree as string;
 28:     if (semester) filter.semester = parseInt(semester as string);
 29:     if (subject) filter.subject = subject as string;
 30:     
 31:     // Date range filtering
 32:     if (startDate || endDate) {
 33:       filter.date = {};
 34:       if (startDate) filter.date.$gte = new Date(startDate as string);
 35:       if (endDate) filter.date.$lte = new Date(endDate as string);
 36:     }
 37: 
 38:     const exams = await Exam.find(filter).sort({ date: 1 });
 39:     res.status(200).json(exams);
 40:   } catch (error) {
 41:     console.error('Get exams error:', error);
 42:     res.status(500).json({ message: 'Server error' });
 43:   }
 44: };
 45: 
 46: /**
 47:  * Get exam by ID
 48:  * @route GET /api/exams/:id
 49:  * @access Public
 50:  */
 51: export const getExamById = async (req: Request, res: Response): Promise<void> => {
 52:   try {
 53:     const exam = await Exam.findById(req.params.id);
 54:     
 55:     if (!exam) {
 56:       res.status(404).json({ message: 'Exam not found' });
 57:       return;
 58:     }
 59:     
 60:     res.status(200).json(exam);
 61:   } catch (error) {
 62:     console.error('Get exam by ID error:', error);
 63:     
 64:     // Check if error is due to invalid ID format
 65:     if (error instanceof mongoose.Error.CastError) {
 66:       res.status(404).json({ message: 'Exam not found' });
 67:       return;
 68:     }
 69:     
 70:     res.status(500).json({ message: 'Server error' });
 71:   }
 72: };
 73: 
 74: /**
 75:  * Create new exam
 76:  * @route POST /api/exams
 77:  * @access Private (Admin only)
 78:  */
 79: export const createExam = async (req: Request, res: Response): Promise<void> => {
 80:   try {
 81:     const { 
 82:       subject, 
 83:       degree, 
 84:       semester, 
 85:       date, 
 86:       startTime, 
 87:       endTime, 
 88:       location, 
 89:       professor, 
 90:       notes 
 91:     } = req.body;
 92: 
 93:     // Create exam
 94:     const exam = await Exam.create({
 95:       subject,
 96:       degree,
 97:       semester,
 98:       date,
 99:       startTime,
100:       endTime,
101:       location,
102:       professor,
103:       notes
104:     });
105: 
106:     res.status(201).json(exam);
107:   } catch (error) {
108:     console.error('Create exam error:', error);
109:     res.status(500).json({ message: 'Server error' });
110:   }
111: };
112: 
113: /**
114:  * Update exam
115:  * @route PUT /api/exams/:id
116:  * @access Private (Admin only)
117:  */
118: export const updateExam = async (req: Request, res: Response): Promise<void> => {
119:   try {
120:     const exam = await Exam.findById(req.params.id);
121:     
122:     if (!exam) {
123:       res.status(404).json({ message: 'Exam not found' });
124:       return;
125:     }
126:     
127:     const updatedExam = await Exam.findByIdAndUpdate(
128:       req.params.id,
129:       req.body,
130:       { new: true, runValidators: true }
131:     );
132:     
133:     res.status(200).json(updatedExam);
134:   } catch (error) {
135:     console.error('Update exam error:', error);
136:     
137:     // Check if error is due to invalid ID format
138:     if (error instanceof mongoose.Error.CastError) {
139:       res.status(404).json({ message: 'Exam not found' });
140:       return;
141:     }
142:     
143:     res.status(500).json({ message: 'Server error' });
144:   }
145: };
146: 
147: /**
148:  * Delete exam
149:  * @route DELETE /api/exams/:id
150:  * @access Private (Admin only)
151:  */
152: export const deleteExam = async (req: Request, res: Response): Promise<void> => {
153:   try {
154:     const exam = await Exam.findById(req.params.id);
155:     
156:     if (!exam) {
157:       res.status(404).json({ message: 'Exam not found' });
158:       return;
159:     }
160:     
161:     await exam.deleteOne();
162:     
163:     res.status(200).json({ message: 'Exam removed' });
164:   } catch (error) {
165:     console.error('Delete exam error:', error);
166:     
167:     // Check if error is due to invalid ID format
168:     if (error instanceof mongoose.Error.CastError) {
169:       res.status(404).json({ message: 'Exam not found' });
170:       return;
171:     }
172:     
173:     res.status(500).json({ message: 'Server error' });
174:   }
175: };
176: 
177: /**
178:  * Get unique filter options (degrees, semesters, subjects)
179:  * @route GET /api/exams/filters
180:  * @access Public
181:  */
182: export const getFilterOptions = async (req: Request, res: Response): Promise<void> => {
183:   try {
184:     // Get unique degrees
185:     const degrees = await Exam.distinct('degree');
186:     
187:     // Get unique semesters
188:     const semesters = await Exam.distinct('semester');
189:     
190:     // Get unique subjects
191:     const subjects = await Exam.distinct('subject');
192:     
193:     res.status(200).json({
194:       degrees,
195:       semesters: semesters.sort((a, b) => a - b), // Sort semesters numerically
196:       subjects: subjects.sort() // Sort subjects alphabetically
197:     });
198:   } catch (error) {
199:     console.error('Get filter options error:', error);
200:     res.status(500).json({ message: 'Server error' });
201:   }
202: };
```

## File: backend/src/middleware/authMiddleware.ts
```typescript
 1: import { Request, Response, NextFunction } from 'express';
 2: import jwt from 'jsonwebtoken';
 3: import User, { IUser } from '../models/User';
 4: 
 5: // Extend Request to include user property
 6: interface AuthRequest extends Request {
 7:   user?: IUser;
 8: }
 9: 
10: /**
11:  * Interface for JWT payload
12:  */
13: interface JwtPayload {
14:   id: string;
15:   iat: number;
16:   exp: number;
17: }
18: 
19: /**
20:  * Middleware to protect routes
21:  * Verifies the JWT token and adds the user to the request object
22:  */
23: export const protect = async (
24:   req: AuthRequest, 
25:   res: Response, 
26:   next: NextFunction
27: ): Promise<void> => {
28:   let token: string | undefined;
29: 
30:   // Check if authorization header exists and starts with Bearer
31:   if (
32:     req.headers.authorization &&
33:     req.headers.authorization.startsWith('Bearer')
34:   ) {
35:     try {
36:       // Get token from header (format: "Bearer token")
37:       token = req.headers.authorization.split(' ')[1];
38: 
39:       // Verify token
40:       const secret = process.env.JWT_SECRET || 'defaultsecret';
41:       const decoded = jwt.verify(token, secret) as JwtPayload;
42: 
43:       // Get user from the token (exclude password)
44:       const user = await User.findById(decoded.id).select('-password');
45: 
46:       if (!user) {
47:         res.status(401).json({ message: 'Not authorized, user not found' });
48:         return;
49:       }
50: 
51:       // Assign to req.user with type assertion
52:       req.user = user as IUser;
53: 
54:       next();
55:     } catch (error) {
56:       console.error('Auth middleware error:', error);
57:       res.status(401).json({ message: 'Not authorized, token failed' });
58:       return;
59:     }
60:   }
61: 
62:   if (!token) {
63:     res.status(401).json({ message: 'Not authorized, no token' });
64:     return;
65:   }
66: };
```

## File: backend/src/middlewares/authMiddleware.js
```javascript
 1: const jwt = require('jsonwebtoken');
 2: const User = require('../models/User');
 3: 
 4: // Middleware to protect routes
 5: const protect = async (req, res, next) => {
 6:   let token;
 7: 
 8:   // Check if token exists in the Authorization header
 9:   if (
10:     req.headers.authorization &&
11:     req.headers.authorization.startsWith('Bearer')
12:   ) {
13:     try {
14:       // Get token from header
15:       token = req.headers.authorization.split(' ')[1];
16: 
17:       // Verify token
18:       const decoded = jwt.verify(token, process.env.JWT_SECRET);
19: 
20:       // Get user from the token
21:       req.user = await User.findById(decoded.id).select('-password');
22: 
23:       next();
24:     } catch (error) {
25:       console.error('Auth middleware error:', error);
26:       res.status(401).json({ message: 'Not authorized, token failed' });
27:     }
28:   }
29: 
30:   if (!token) {
31:     res.status(401).json({ message: 'Not authorized, no token' });
32:   }
33: };
34: 
35: module.exports = { protect };
```

## File: backend/src/models/Exam.ts
```typescript
 1: import mongoose, { Document, Schema } from 'mongoose';
 2: 
 3: // Interface for TypeScript type safety
 4: export interface IExam extends Document {
 5:   subject: string;
 6:   degree: string;
 7:   semester: number;
 8:   date: Date;
 9:   startTime: string;
10:   endTime: string;
11:   location: string;
12:   professor?: string;
13:   notes?: string;
14:   createdAt: Date;
15: }
16: 
17: const examSchema = new Schema<IExam>({
18:   subject: {
19:     type: String,
20:     required: true,
21:     trim: true
22:   },
23:   degree: {
24:     type: String,
25:     required: true,
26:     trim: true
27:   },
28:   semester: {
29:     type: Number,
30:     required: true,
31:     min: 1,
32:     max: 8
33:   },
34:   date: {
35:     type: Date,
36:     required: true
37:   },
38:   startTime: {
39:     type: String,
40:     required: true
41:   },
42:   endTime: {
43:     type: String,
44:     required: true
45:   },
46:   location: {
47:     type: String,
48:     required: true,
49:     trim: true
50:   },
51:   professor: {
52:     type: String,
53:     trim: true
54:   },
55:   notes: {
56:     type: String,
57:     trim: true
58:   },
59:   createdAt: {
60:     type: Date,
61:     default: Date.now
62:   }
63: });
64: 
65: export default mongoose.model<IExam>('Exam', examSchema);
```

## File: backend/src/models/User.ts
```typescript
  1: import mongoose, { Document, Schema } from 'mongoose';
  2: import bcrypt from 'bcryptjs';
  3: 
  4: // Interfaces for TypeScript type safety
  5: export interface IFilter {
  6:   degrees: string[];
  7:   semesters: string[];
  8:   subjects: string[];
  9: }
 10: 
 11: export interface ICalendar {
 12:   _id: mongoose.Types.ObjectId;
 13:   name: string;
 14:   description: string;
 15:   filters: IFilter;
 16:   createdAt: Date;
 17: }
 18: 
 19: export interface IUser extends Document {
 20:   _id: mongoose.Types.ObjectId;
 21:   name: string;
 22:   email: string;
 23:   password: string;
 24:   savedCalendars: ICalendar[];
 25:   createdAt: Date;
 26:   matchPassword(enteredPassword: string): Promise<boolean>;
 27: }
 28: 
 29: // Calendar filter schema
 30: const filterSchema = new Schema<IFilter>({
 31:   degrees: {
 32:     type: [String],
 33:     default: []
 34:   },
 35:   semesters: {
 36:     type: [String],
 37:     default: []
 38:   },
 39:   subjects: {
 40:     type: [String],
 41:     default: []
 42:   }
 43: }, { _id: false });
 44: 
 45: // Calendar schema (as subdocument)
 46: const calendarSchema = new Schema<ICalendar>({
 47:   name: {
 48:     type: String,
 49:     required: true
 50:   },
 51:   description: {
 52:     type: String,
 53:     default: ''
 54:   },
 55:   filters: {
 56:     type: filterSchema,
 57:     default: () => ({})
 58:   },
 59:   createdAt: {
 60:     type: Date,
 61:     default: Date.now
 62:   }
 63: }, { _id: true });
 64: 
 65: // User schema
 66: const userSchema = new Schema<IUser>({
 67:   name: {
 68:     type: String,
 69:     required: true
 70:   },
 71:   email: {
 72:     type: String,
 73:     required: true,
 74:     unique: true,
 75:     lowercase: true,
 76:     trim: true
 77:   },
 78:   password: {
 79:     type: String,
 80:     required: true,
 81:     minlength: 6
 82:   },
 83:   savedCalendars: [calendarSchema],
 84:   createdAt: {
 85:     type: Date,
 86:     default: Date.now
 87:   }
 88: });
 89: 
 90: // Hash password before saving
 91: userSchema.pre('save', async function(next) {
 92:   // Only hash the password if it's modified (or new)
 93:   if (!this.isModified('password')) {
 94:     return next();
 95:   }
 96:   
 97:   try {
 98:     // Generate salt
 99:     const salt = await bcrypt.genSalt(10);
100:     // Hash password
101:     this.password = await bcrypt.hash(this.password, salt);
102:     next();
103:   } catch (error) {
104:     next(error as Error);
105:   }
106: });
107: 
108: // Method to compare password
109: userSchema.methods.matchPassword = async function(enteredPassword: string): Promise<boolean> {
110:   return await bcrypt.compare(enteredPassword, this.password);
111: };
112: 
113: export default mongoose.model<IUser>('User', userSchema);
```

## File: backend/src/routes/authRoutes.ts
```typescript
 1: import express from 'express';
 2: import { 
 3:   registerUser, 
 4:   loginUser, 
 5:   getUserProfile,
 6:   saveCalendar,
 7:   deleteCalendar,
 8:   refreshToken
 9: } from '../controllers/authController';
10: import { protect } from '../middleware/authMiddleware';
11: 
12: const router = express.Router();
13: 
14: // Public routes
15: router.post('/register', registerUser);
16: router.post('/login', loginUser);
17: 
18: // Protected routes - require authentication
19: router.get('/profile', protect, getUserProfile);
20: router.post('/calendar', protect, saveCalendar);
21: router.delete('/calendar/:id', protect, deleteCalendar);
22: router.post('/refresh', protect, refreshToken);
23: 
24: export default router;
```

## File: backend/src/routes/examRoutes.ts
```typescript
 1: import express from 'express';
 2: import {
 3:   getExams,
 4:   getExamById,
 5:   createExam,
 6:   updateExam,
 7:   deleteExam,
 8:   getFilterOptions
 9: } from '../controllers/examController';
10: import { protect } from '../middleware/authMiddleware';
11: 
12: const router = express.Router();
13: 
14: // Get filter options (degrees, semesters, subjects)
15: router.get('/filters', getFilterOptions);
16: 
17: // Public exam routes
18: router.get('/', getExams);
19: router.get('/:id', getExamById);
20: 
21: // Protected admin routes
22: // In a real app, you would add an admin middleware check here
23: router.post('/', protect, createExam);
24: router.put('/:id', protect, updateExam);
25: router.delete('/:id', protect, deleteExam);
26: 
27: export default router;
```

## File: backend/src/utils/generateToken.ts
```typescript
 1: import jwt from 'jsonwebtoken';
 2: import { Types } from 'mongoose';
 3: 
 4: /**
 5:  * Generate a JWT token for authentication
 6:  * @param {string | Types.ObjectId} id - User ID to include in token payload
 7:  * @returns {string} JWT token
 8:  */
 9: const generateToken = (id: string | Types.ObjectId): string => {
10:   const secret = process.env.JWT_SECRET || 'defaultsecret';
11:   
12:   return jwt.sign({ id }, secret, {
13:     expiresIn: '30d', // Token expires in 30 days
14:   });
15: };
16: 
17: export default generateToken;
```

## File: backend/src/utils/seeder.ts
```typescript
  1: import mongoose from 'mongoose';
  2: import dotenv from 'dotenv';
  3: import path from 'path';
  4: import Exam, { IExam } from '../models/Exam';
  5: 
  6: // Load env vars (adjust path relative to the location of this file)
  7: dotenv.config({ path: path.join(__dirname, '../../.env') });
  8: 
  9: // Connect to MongoDB
 10: mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/upv_calendar');
 11: 
 12: // Sample exam data
 13: const exams = [
 14:   {
 15:     subject: 'Mathematics I',
 16:     degree: 'Computer Science',
 17:     semester: 1,
 18:     date: new Date('2024-06-10'),
 19:     startTime: '09:00',
 20:     endTime: '11:00',
 21:     location: 'Room A-101',
 22:     professor: 'Dr. Smith',
 23:     notes: 'Bring calculator and formula sheet'
 24:   },
 25:   {
 26:     subject: 'Programming Fundamentals',
 27:     degree: 'Computer Science',
 28:     semester: 1,
 29:     date: new Date('2024-06-12'),
 30:     startTime: '10:00',
 31:     endTime: '12:00',
 32:     location: 'Computer Lab B-201',
 33:     professor: 'Dr. Johnson',
 34:     notes: 'Practical exam, no books allowed'
 35:   },
 36:   {
 37:     subject: 'Physics I',
 38:     degree: 'Computer Science',
 39:     semester: 1,
 40:     date: new Date('2024-06-15'),
 41:     startTime: '11:00',
 42:     endTime: '13:00',
 43:     location: 'Room A-102',
 44:     professor: 'Dr. Garcia',
 45:     notes: 'Multiple choice and problem solving'
 46:   },
 47:   {
 48:     subject: 'English',
 49:     degree: 'Computer Science',
 50:     semester: 1,
 51:     date: new Date('2024-06-18'),
 52:     startTime: '14:00',
 53:     endTime: '16:00',
 54:     location: 'Room A-103',
 55:     professor: 'Dr. Wilson',
 56:     notes: 'Writing and listening test'
 57:   },
 58:   {
 59:     subject: 'Programming Fundamentals',
 60:     degree: 'Telecommunications',
 61:     semester: 1,
 62:     date: new Date('2024-06-14'),
 63:     startTime: '09:30',
 64:     endTime: '11:30',
 65:     location: 'Computer Lab B-202',
 66:     professor: 'Dr. Johnson',
 67:     notes: 'Practical exam, no books allowed'
 68:   },
 69:   {
 70:     subject: 'Mathematics II',
 71:     degree: 'Computer Science',
 72:     semester: 2,
 73:     date: new Date('2024-06-20'),
 74:     startTime: '09:00',
 75:     endTime: '11:00',
 76:     location: 'Room A-201',
 77:     professor: 'Dr. Smith',
 78:     notes: 'Bring calculator and formula sheet'
 79:   },
 80:   {
 81:     subject: 'Data Structures',
 82:     degree: 'Computer Science',
 83:     semester: 2,
 84:     date: new Date('2024-06-22'),
 85:     startTime: '10:00',
 86:     endTime: '12:00',
 87:     location: 'Computer Lab B-203',
 88:     professor: 'Dr. Brown',
 89:     notes: 'Practical and theoretical components'
 90:   },
 91:   {
 92:     subject: 'Databases',
 93:     degree: 'Computer Science',
 94:     semester: 3,
 95:     date: new Date('2024-06-24'),
 96:     startTime: '09:00',
 97:     endTime: '11:00',
 98:     location: 'Computer Lab B-204',
 99:     professor: 'Dr. Lee',
100:     notes: 'SQL and database design'
101:   },
102:   {
103:     subject: 'Software Engineering',
104:     degree: 'Computer Science',
105:     semester: 3,
106:     date: new Date('2024-06-26'),
107:     startTime: '11:00',
108:     endTime: '13:00',
109:     location: 'Room A-204',
110:     professor: 'Dr. Martinez',
111:     notes: 'Group project presentation'
112:   },
113:   {
114:     subject: 'Computer Networks',
115:     degree: 'Telecommunications',
116:     semester: 3,
117:     date: new Date('2024-06-28'),
118:     startTime: '14:00',
119:     endTime: '16:00',
120:     location: 'Lab C-101',
121:     professor: 'Dr. Rodriguez',
122:     notes: 'Network configuration practical'
123:   }
124: ];
125: 
126: /**
127:  * Import sample data to database
128:  */
129: const importData = async (): Promise<void> => {
130:   try {
131:     // Clear existing data
132:     await Exam.deleteMany({});
133:     console.log('Data cleared...');
134: 
135:     // Insert sample exams
136:     await Exam.insertMany(exams);
137:     console.log('Data imported successfully!');
138:     process.exit(0);
139:   } catch (error) {
140:     console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
141:     process.exit(1);
142:   }
143: };
144: 
145: /**
146:  * Delete all data from the database
147:  */
148: const deleteData = async (): Promise<void> => {
149:   try {
150:     await Exam.deleteMany({});
151:     console.log('Data destroyed successfully!');
152:     process.exit(0);
153:   } catch (error) {
154:     console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
155:     process.exit(1);
156:   }
157: };
158: 
159: // Check command line argument and execute appropriate function
160: if (process.argv[2] === '-i') {
161:   importData();
162: } else if (process.argv[2] === '-d') {
163:   deleteData();
164: } else {
165:   console.log('Please use correct command:');
166:   console.log('  ts-node seeder.ts -i  (to import data)');
167:   console.log('  ts-node seeder.ts -d  (to delete data)');
168:   process.exit(0);
169: }
```

## File: backend/src/server.ts
```typescript
 1: import express, { Request, Response, NextFunction } from 'express';
 2: import cors from 'cors';
 3: import { config as dotenvConfig } from 'dotenv';
 4: import mongoose from 'mongoose';
 5: import { Pool } from 'pg';
 6: 
 7: // Import routes
 8: import authRoutes from './routes/authRoutes';
 9: import examRoutes from './routes/examRoutes';
10: 
11: // Load environment variables
12: dotenvConfig();
13: 
14: // Create Express app
15: const app = express();
16: const PORT = process.env.PORT || 3000;
17: 
18: // Middleware
19: app.use(cors());
20: app.use(express.json());
21: app.use(express.urlencoded({ extended: false }));
22: 
23: // Connect to MongoDB
24: const connectMongoDB = async (): Promise<void> => {
25:   try {
26:     const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/upv_calendar';
27:     const conn = await mongoose.connect(mongoURI);
28:     console.log(`MongoDB connected: ${conn.connection.host}`);
29:   } catch (error) {
30:     console.error(`MongoDB connection error: ${error instanceof Error ? error.message : 'Unknown error'}`);
31:     process.exit(1);
32:   }
33: };
34: 
35: // Connect to PostgreSQL 
36: const pool = new Pool({
37:   user: process.env.PG_USER || 'postgres',
38:   host: process.env.PG_HOST || 'localhost',
39:   database: process.env.PG_DATABASE || 'upv_calendar',
40:   password: process.env.PG_PASSWORD || 'postgres',
41:   port: parseInt(process.env.PG_PORT || '5432'),
42: });
43: 
44: // Test PostgreSQL connection
45: pool.query('SELECT NOW()', (err, res) => {
46:   if (err) {
47:     console.error('PostgreSQL connection error:', err);
48:   } else {
49:     console.log('PostgreSQL connected successfully:', res.rows[0].now);
50:   }
51: });
52: 
53: // Routes
54: app.use('/api/auth', authRoutes);
55: app.use('/api/exams', examRoutes);
56: 
57: // Health check endpoint
58: app.get('/', (req: Request, res: Response) => {
59:   res.json({ message: 'UPV Calendar API Server Running' });
60: });
61: 
62: // Error handler middleware
63: app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
64:   console.error(err.stack);
65:   res.status(500).json({
66:     message: 'Server error',
67:     error: process.env.NODE_ENV === 'development' ? err.message : undefined
68:   });
69: });
70: 
71: // Start the server
72: const startServer = async (): Promise<void> => {
73:   try {
74:     // Connect to MongoDB first
75:     await connectMongoDB();
76:     
77:     // Start the Express server
78:     app.listen(PORT, () => {
79:       console.log(`Server running on port ${PORT}`);
80:     });
81:   } catch (error) {
82:     console.error('Server startup error:', error);
83:     process.exit(1);
84:   }
85: };
86: 
87: // Start the server
88: startServer();
```

## File: backend/import_exam_data.ts
```typescript
  1: // Script to import exam data from ETSINFexams.txt into PostgreSQL database
  2: import * as fs from 'fs';
  3: import * as path from 'path';
  4: import { Pool, PoolClient } from 'pg';
  5: import * as dotenv from 'dotenv';
  6: 
  7: // Load environment variables
  8: dotenv.config();
  9: 
 10: // Define interfaces for our data models
 11: interface Subject {
 12:   code: string;
 13:   name: string;
 14:   acronym: string | null;
 15: }
 16: 
 17: interface Exam {
 18:   date: string;
 19:   startTime: string;
 20:   durationMinutes: number;
 21:   subjectKey: string;
 22:   degree: string;
 23:   year: number;
 24:   semester: string;
 25:   place: string | null;
 26:   notes: string | null;
 27: }
 28: 
 29: interface ParsedData {
 30:   subjects: Subject[];
 31:   places: string[];
 32:   exams: Exam[];
 33: }
 34: 
 35: // PostgreSQL connection configuration
 36: const pool = new Pool({
 37:   user: process.env.PG_USER || 'postgres',
 38:   host: process.env.PG_HOST || 'localhost',
 39:   database: process.env.PG_DATABASE || 'examdb',
 40:   password: process.env.PG_PASSWORD || 'postgres',
 41:   port: parseInt(process.env.PG_PORT || '5432'),
 42: });
 43: 
 44: // Path to the exams file - updated to resolve correctly
 45: const examsFilePath = path.join(__dirname, '../ETSINFexams.txt');
 46: 
 47: /**
 48:  * Parse the ETSINFexams.txt file and extract exam data
 49:  * @returns Object containing parsed subjects, places, and exams
 50:  */
 51: async function parseExamsFile(): Promise<ParsedData> {
 52:   try {
 53:     const data = fs.readFileSync(examsFilePath, 'utf8');
 54:     const lines = data.split('\n').filter(line => line.trim() !== '');
 55:     
 56:     // Maps and Sets to store unique records
 57:     const subjects = new Map<string, Subject>();
 58:     const places = new Set<string>();
 59:     
 60:     // Array to store all exam records
 61:     const exams: Exam[] = [];
 62:     
 63:     // Define degree codes for identification
 64:     const degreeCodes = ['GIINF', 'GCD', 'GIIROB', 'MUIINF', 'MUHD', 'MUCC', 'IDIOMES', 'GIINF-GADE', 'GIINF-GMAT', 'GCD-GIOI'];
 65:     
 66:     // Parse each line of the file
 67:     for (const line of lines) {
 68:       // Extract date and time (format: "FEB  2 13:30")
 69:       const dateTimeMatch = line.match(/^(\w{3})\s+(\d+)\s+(\d+):(\d+)/);
 70:       if (!dateTimeMatch) continue;
 71:       
 72:       const [, monthStr, day, hour, minute] = dateTimeMatch;
 73:       
 74:       // Map month abbreviation to month number
 75:       const monthMap: Record<string, number> = {
 76:         'JAN': 1, 'FEB': 2, 'MAR': 3, 'APR': 4, 'MAY': 5, 'JUN': 6,
 77:         'JUL': 7, 'AUG': 8, 'SEP': 9, 'OCT': 10, 'NOV': 11, 'DEC': 12
 78:       };
 79:       
 80:       const month = monthMap[monthStr];
 81:       if (!month) continue; // Skip if invalid month
 82:       
 83:       const currentYear = new Date().getFullYear();
 84:       
 85:       // Create a date string in PostgreSQL format YYYY-MM-DD
 86:       const date = `${currentYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
 87:       const time = `${hour}:${minute}`;
 88:       
 89:       // Extract duration (format: "[1.5h]" or "[2h]")
 90:       const durationMatch = line.match(/\[(\d+(\.\d+)?)h\]/);
 91:       const durationHours = durationMatch ? parseFloat(durationMatch[1]) : 1.5;
 92:       const durationMinutes = Math.round(durationHours * 60);
 93:       
 94:       // Extract remaining information after date/time
 95:       const afterDateTime = line.substring(dateTimeMatch[0].length).trim();
 96:       
 97:       // Extract place (usually at the end of the line)
 98:       const placeMatch = afterDateTime.match(/\s+([^-]+)(\([^)]+\))?$/);
 99:       const place = placeMatch ? placeMatch[1].trim() : null;
100:       
101:       if (place) places.add(place);
102:       
103:       // Extract degree and subject information
104:       let degree: string | null = null;
105:       let subjectInfo = afterDateTime;
106:       
107:       if (placeMatch) {
108:         subjectInfo = afterDateTime.substring(0, afterDateTime.lastIndexOf(placeMatch[0])).trim();
109:       }
110:       
111:       // Determine degree code
112:       for (const code of degreeCodes) {
113:         if (subjectInfo.includes(code)) {
114:           degree = code;
115:           break;
116:         }
117:       }
118:       
119:       // Default to GIINF if degree not found
120:       if (!degree) {
121:         degree = 'GIINF';
122:       }
123:       
124:       // Remove degree code from subject info
125:       if (degree && subjectInfo.includes(degree)) {
126:         subjectInfo = subjectInfo.replace(degree, '').trim();
127:       }
128:       
129:       // Extract subject code if present (usually 5 digits)
130:       const subjectCodeMatch = subjectInfo.match(/\b(\d{5})\b/);
131:       const subjectCode = subjectCodeMatch ? subjectCodeMatch[1] : null;
132:       
133:       // Clean up subject name
134:       let subjectName = subjectInfo;
135:       if (durationMatch) {
136:         subjectName = subjectName.replace(durationMatch[0], '').trim();
137:       }
138:       
139:       // Extract notes in parentheses
140:       const notesMatch = subjectName.match(/\(([^)]+)\)/);
141:       const notes = notesMatch ? notesMatch[1] : null;
142:       if (notesMatch) {
143:         subjectName = subjectName.replace(notesMatch[0], '').trim();
144:       }
145:       
146:       // Clean up extra dashes or spaces
147:       subjectName = subjectName.replace(/\s*-\s*/g, ' ').trim();
148:       
149:       // Extract acronym if present (2-4 capital letters)
150:       const acronymMatch = subjectName.match(/\b([A-Z]{2,4})\b/);
151:       const acronym = acronymMatch ? acronymMatch[1] : null;
152:       
153:       // Determine academic year and semester
154:       const academicYear = subjectCode ? Math.floor(parseInt(subjectCode) / 10000) : 1;
155:       const semester = 'A'; // Default to first semester
156:       
157:       // Store subject if not already stored
158:       const subjectKey = `${subjectCode || ''}-${subjectName}`;
159:       if (!subjects.has(subjectKey)) {
160:         subjects.set(subjectKey, {
161:           code: subjectCode || subjectName.substring(0, 10),
162:           name: subjectName,
163:           acronym: acronym
164:         });
165:       }
166:       
167:       // Create exam record
168:       exams.push({
169:         date,
170:         startTime: time,
171:         durationMinutes,
172:         subjectKey,
173:         degree,
174:         year: academicYear,
175:         semester,
176:         place,
177:         notes
178:       });
179:     }
180:     
181:     return {
182:       subjects: Array.from(subjects.values()),
183:       places: Array.from(places),
184:       exams
185:     };
186:     
187:   } catch (error) {
188:     console.error('Error parsing exams file:', error);
189:     throw error;
190:   }
191: }
192: 
193: /**
194:  * Import parsed data into PostgreSQL database
195:  */
196: async function importDataToDatabase(): Promise<void> {
197:   const client: PoolClient = await pool.connect();
198:   
199:   try {
200:     // Start a transaction
201:     await client.query('BEGIN');
202:     
203:     // Parse the exams file
204:     const { subjects, places, exams } = await parseExamsFile();
205:     
206:     console.log(`Parsed ${subjects.length} subjects, ${places.length} places, and ${exams.length} exams`);
207:     
208:     // Insert places
209:     const placesMap = new Map<string, number>();
210:     for (const place of places) {
211:       if (place) {
212:         const result = await client.query(
213:           'INSERT INTO places (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = $1 RETURNING id',
214:           [place]
215:         );
216:         placesMap.set(place, result.rows[0].id);
217:       }
218:     }
219:     
220:     // Insert subjects
221:     const subjectsMap = new Map<string, number>();
222:     for (const subject of subjects) {
223:       const result = await client.query(
224:         'INSERT INTO subjects (code, name, acronym) VALUES ($1, $2, $3) ON CONFLICT (code, name) DO UPDATE SET acronym = $3 RETURNING id',
225:         [subject.code, subject.name, subject.acronym]
226:       );
227:       subjectsMap.set(`${subject.code}-${subject.name}`, result.rows[0].id);
228:     }
229:     
230:     // Get degree IDs
231:     const degreesResult = await client.query('SELECT id, code FROM degrees');
232:     const degreesMap = new Map<string, number>();
233:     degreesResult.rows.forEach(row => degreesMap.set(row.code, row.id));
234:     
235:     // Insert exams
236:     for (const exam of exams) {
237:       const subjectId = subjectsMap.get(`${exam.subjectKey}`);
238:       const degreeId = degreesMap.get(exam.degree);
239:       const placeId = exam.place ? placesMap.get(exam.place) : null;
240:       
241:       if (!subjectId || !degreeId) {
242:         console.warn(`Missing subject or degree for exam: ${JSON.stringify(exam)}`);
243:         continue;
244:       }
245:       
246:       await client.query(
247:         `INSERT INTO exam_schedule 
248:          (date, start_time, duration_minutes, subject_id, degree_id, year, semester, place_id, notes)
249:          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
250:          ON CONFLICT (date, start_time, subject_id, degree_id) 
251:          DO UPDATE SET 
252:            duration_minutes = $3,
253:            year = $6,
254:            semester = $7,
255:            place_id = $8,
256:            notes = $9`,
257:         [
258:           exam.date, 
259:           exam.startTime, 
260:           exam.durationMinutes,
261:           subjectId,
262:           degreeId,
263:           exam.year,
264:           exam.semester,
265:           placeId,
266:           exam.notes
267:         ]
268:       );
269:     }
270:     
271:     // Commit the transaction
272:     await client.query('COMMIT');
273:     console.log('Successfully imported all exam data');
274:     
275:   } catch (error) {
276:     // Rollback the transaction in case of error
277:     await client.query('ROLLBACK');
278:     console.error('Error importing data to database:', error instanceof Error ? error.message : String(error));
279:     throw error;
280:   } finally {
281:     client.release();
282:   }
283: }
284: 
285: /**
286:  * Main function to run the import process
287:  */
288: async function main(): Promise<void> {
289:   try {
290:     console.log('Starting exam data import...');
291:     await importDataToDatabase();
292:     console.log('Import completed successfully');
293:     process.exit(0);
294:   } catch (error) {
295:     console.error('Import failed:', error instanceof Error ? error.message : String(error));
296:     process.exit(1);
297:   }
298: }
299: 
300: // Run the main function
301: main();
```

## File: backend/package.json
```json
 1: {
 2:   "name": "upv-calendar-backend",
 3:   "version": "1.0.0",
 4:   "description": "Backend for UPV Calendar app",
 5:   "main": "dist/server.js",
 6:   "scripts": {
 7:     "start": "node dist/server.js",
 8:     "dev": "nodemon --watch src --exec ts-node src/server.ts",
 9:     "build": "tsc",
10:     "seed:import": "ts-node src/utils/seeder.ts -i",
11:     "seed:destroy": "ts-node src/utils/seeder.ts -d",
12:     "import:exams": "ts-node import_exam_data.ts",
13:     "test": "echo \"Error: no test specified\" && exit 1"
14:   },
15:   "keywords": [
16:     "calendar",
17:     "api",
18:     "upv"
19:   ],
20:   "author": "",
21:   "license": "ISC",
22:   "dependencies": {
23:     "bcryptjs": "^2.4.3",
24:     "body-parser": "^1.20.2",
25:     "cors": "^2.8.5",
26:     "dotenv": "^16.3.1",
27:     "express": "^4.18.2",
28:     "jsonwebtoken": "^9.0.1",
29:     "mongoose": "^7.4.3",
30:     "pg": "^8.11.3",
31:     "upv-calendar-backend": "file:"
32:   },
33:   "devDependencies": {
34:     "@types/bcryptjs": "^2.4.2",
35:     "@types/cors": "^2.8.13",
36:     "@types/dotenv": "^6.1.1",
37:     "@types/express": "^4.17.17",
38:     "@types/jsonwebtoken": "^9.0.2",
39:     "@types/node": "^20.17.30",
40:     "@types/pg": "^8.11.13",
41:     "nodemon": "^3.0.1",
42:     "ts-node": "^10.9.1",
43:     "typescript": "^5.1.6"
44:   }
45: }
```

## File: backend/seed-db.bat
```
 1: @echo off
 2: echo UPV Calendar Database Seeder
 3: 
 4: cd %~dp0
 5: echo.
 6: echo Choose an option:
 7: echo 1. Import sample data
 8: echo 2. Delete all data
 9: echo 3. Import exam data
10: echo.
11: set /p option="Enter option (1, 2, or 3): "
12: 
13: if "%option%"=="1" (
14:   echo.
15:   echo Importing sample data...
16:   cd src\utils
17:   ts-node seeder.ts -i
18: ) else if "%option%"=="2" (
19:   echo.
20:   echo Deleting all data...
21:   cd src\utils
22:   ts-node seeder.ts -d
23: ) else if "%option%"=="3" (
24:   echo.
25:   echo Importing exam data from ETSINFexams.txt...
26:   npm run import:exams
27: ) else (
28:   echo.
29:   echo Invalid option. Please run again and select 1, 2, or 3.
30: )
31: 
32: echo.
33: pause
```

## File: backend/server.ts
```typescript
  1: // Import required packages
  2: import express, { Request, Response, NextFunction } from 'express';
  3: import bodyParser from 'body-parser';
  4: import cors from 'cors';
  5: import { Pool } from 'pg';
  6: 
  7: // Define interfaces for our data models
  8: interface User {
  9:   id: number;
 10:   email: string;
 11:   password: string;
 12:   name?: string;
 13: }
 14: 
 15: interface Calendar {
 16:   id: number;
 17:   user_id: number;
 18:   name: string;
 19:   filters?: {
 20:     degrees?: string[];
 21:     semesters?: number[];
 22:     subjects?: string[];
 23:   };
 24: }
 25: 
 26: interface Exam {
 27:   id: number;
 28:   subject: string;
 29:   date: string;
 30:   time: string;
 31:   location: string;
 32:   degree: string;
 33:   semester: number;
 34:   notes?: string;
 35: }
 36: 
 37: // Initialize Express app
 38: const app = express();
 39: const PORT = process.env.PORT || 3000;
 40: 
 41: // Configure middleware
 42: app.use(cors());
 43: app.use(bodyParser.json());
 44: app.use(bodyParser.urlencoded({ extended: true }));
 45: 
 46: // Database connection
 47: const pool = new Pool({
 48:   user: "postgres",
 49:   host: "localhost",
 50:   database: "upv_calendar",
 51:   password: "postgres",
 52:   port: 5432,
 53: });
 54: 
 55: // Function to validate email format
 56: const validateEmail = (email: string): boolean => {
 57:   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 58:   return emailRegex.test(email);
 59: };
 60: 
 61: // Basic middleware for logging requests
 62: app.use((req: Request, res: Response, next: NextFunction) => {
 63:   console.log(`${req.method} ${req.path}`);
 64:   next();
 65: });
 66: 
 67: // Health check endpoint
 68: app.get('/', (req: Request, res: Response) => {
 69:   res.json({ message: 'Welcome to UPV Calendar API' });
 70: });
 71: 
 72: // User registration
 73: app.post('/api/register', async (req: Request, res: Response) => {
 74:   try {
 75:     const { email, password, name } = req.body;
 76: 
 77:     // Validate email and password
 78:     if (!email || !password) {
 79:       return res.status(400).json({ message: 'Email and password are required' });
 80:     }
 81: 
 82:     if (!validateEmail(email)) {
 83:       return res.status(400).json({ message: 'Invalid email format' });
 84:     }
 85: 
 86:     if (password.length < 6) {
 87:       return res.status(400).json({ message: 'Password must be at least 6 characters' });
 88:     }
 89: 
 90:     // Check if user already exists
 91:     const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
 92: 
 93:     if (userCheck.rows.length > 0) {
 94:       return res.status(400).json({ message: 'User already exists' });
 95:     }
 96: 
 97:     // Insert new user
 98:     const result = await pool.query(
 99:       'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id',
100:       [email, password, name || email.split('@')[0]]
101:     );
102: 
103:     // Return success with user id
104:     res.status(201).json({ 
105:       message: 'User registered successfully', 
106:       userId: result.rows[0].id 
107:     });
108:   } catch (error) {
109:     console.error('Error during registration:', error);
110:     res.status(500).json({ message: 'Server error during registration' });
111:   }
112: });
113: 
114: // User login
115: app.post('/api/login', async (req: Request, res: Response) => {
116:   try {
117:     const { email, password } = req.body;
118: 
119:     // Validate input
120:     if (!email || !password) {
121:       return res.status(400).json({ message: 'Email and password are required' });
122:     }
123: 
124:     // Find user
125:     const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
126: 
127:     if (result.rows.length === 0) {
128:       return res.status(401).json({ message: 'Invalid credentials' });
129:     }
130: 
131:     const user = result.rows[0] as User;
132: 
133:     // Check password
134:     if (user.password !== password) {
135:       return res.status(401).json({ message: 'Invalid credentials' });
136:     }
137: 
138:     // Return user info
139:     res.json({
140:       message: 'Login successful',
141:       user: {
142:         id: user.id,
143:         email: user.email,
144:         name: user.name || user.email.split('@')[0]
145:       }
146:     });
147:   } catch (error) {
148:     console.error('Error during login:', error);
149:     res.status(500).json({ message: 'Server error during login' });
150:   }
151: });
152: 
153: // Get all calendars for a user
154: app.get('/api/calendars/:userId', async (req: Request, res: Response) => {
155:   try {
156:     const userId = parseInt(req.params.userId);
157: 
158:     if (isNaN(userId)) {
159:       return res.status(400).json({ message: 'Invalid user ID' });
160:     }
161: 
162:     const result = await pool.query('SELECT * FROM calendars WHERE user_id = $1', [userId]);
163:     
164:     res.json(result.rows);
165:   } catch (error) {
166:     console.error('Error fetching calendars:', error);
167:     res.status(500).json({ message: 'Server error while fetching calendars' });
168:   }
169: });
170: 
171: // Create a new calendar
172: app.post('/api/calendars', async (req: Request, res: Response) => {
173:   try {
174:     const { userId, name, filters } = req.body;
175: 
176:     if (!userId || !name) {
177:       return res.status(400).json({ message: 'User ID and calendar name are required' });
178:     }
179: 
180:     const result = await pool.query(
181:       'INSERT INTO calendars (user_id, name, filters) VALUES ($1, $2, $3) RETURNING *',
182:       [userId, name, filters ? JSON.stringify(filters) : null]
183:     );
184: 
185:     res.status(201).json(result.rows[0]);
186:   } catch (error) {
187:     console.error('Error creating calendar:', error);
188:     res.status(500).json({ message: 'Server error while creating calendar' });
189:   }
190: });
191: 
192: // Update a calendar
193: app.put('/api/calendars/:id', async (req: Request, res: Response) => {
194:   try {
195:     const calendarId = parseInt(req.params.id);
196:     const { name, filters } = req.body;
197: 
198:     if (isNaN(calendarId)) {
199:       return res.status(400).json({ message: 'Invalid calendar ID' });
200:     }
201: 
202:     if (!name) {
203:       return res.status(400).json({ message: 'Calendar name is required' });
204:     }
205: 
206:     const result = await pool.query(
207:       'UPDATE calendars SET name = $1, filters = $2 WHERE id = $3 RETURNING *',
208:       [name, filters ? JSON.stringify(filters) : null, calendarId]
209:     );
210: 
211:     if (result.rows.length === 0) {
212:       return res.status(404).json({ message: 'Calendar not found' });
213:     }
214: 
215:     res.json(result.rows[0]);
216:   } catch (error) {
217:     console.error('Error updating calendar:', error);
218:     res.status(500).json({ message: 'Server error while updating calendar' });
219:   }
220: });
221: 
222: // Delete a calendar
223: app.delete('/api/calendars/:id', async (req: Request, res: Response) => {
224:   try {
225:     const calendarId = parseInt(req.params.id);
226: 
227:     if (isNaN(calendarId)) {
228:       return res.status(400).json({ message: 'Invalid calendar ID' });
229:     }
230: 
231:     const result = await pool.query('DELETE FROM calendars WHERE id = $1 RETURNING *', [calendarId]);
232: 
233:     if (result.rows.length === 0) {
234:       return res.status(404).json({ message: 'Calendar not found' });
235:     }
236: 
237:     res.json({ message: 'Calendar deleted successfully' });
238:   } catch (error) {
239:     console.error('Error deleting calendar:', error);
240:     res.status(500).json({ message: 'Server error while deleting calendar' });
241:   }
242: });
243: 
244: // Get all exams
245: app.get('/api/exams', async (req: Request, res: Response) => {
246:   try {
247:     const result = await pool.query('SELECT * FROM exams');
248:     
249:     res.json(result.rows);
250:   } catch (error) {
251:     console.error('Error fetching exams:', error);
252:     res.status(500).json({ message: 'Server error while fetching exams' });
253:   }
254: });
255: 
256: // Start the server
257: app.listen(PORT, () => {
258:   console.log(`Server is running on port ${PORT}`);
259: });
260: 
261: /* 
262: Note for production:
263: - Use environment variables for database credentials
264: - Implement proper password hashing (e.g., bcrypt)
265: - Add JWT for authentication
266: - Add rate limiting and CSRF protection
267: - Use HTTPS
268: */
```

## File: backend/tsconfig.json
```json
 1: {
 2:   "compilerOptions": {
 3:     "target": "es2016",
 4:     "module": "commonjs",
 5:     "outDir": "./dist",
 6:     "rootDir": ".",
 7:     "strict": true,
 8:     "esModuleInterop": true,
 9:     "skipLibCheck": true,
10:     "forceConsistentCasingInFileNames": true,
11:     "resolveJsonModule": true
12:   },
13:   "include": ["src/**/*", "import_exam_data.ts"],
14:   "exclude": ["node_modules", "**/*.test.ts", "dist"]
15: }
```
