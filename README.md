# UPV Calendar System

A dynamic calendar system for managing university exams with authentication and calendar saving capabilities.

## Features

- **Calendar View**: A modern, filterable calendar showing scheduled exams
- **Multi-select Filters**: Filter exams by degree, semester, and subject
- **User Authentication**: Register, login, and save personalized calendars
- **Exam Management**: View, add, update, and delete exam entries
- **Responsive Design**: Mobile-friendly interface

## Technology Stack

### Frontend
- Angular (Standalone Components)
- TypeScript
- RxJS
- Angular HTTP Client

### Backend
- Node.js
- Express.js
- MongoDB (Authentication, User Data)
- PostgreSQL (Legacy Exam Data)
- JWT Authentication

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (v4+)
- PostgreSQL (v12+)

### Installation

1. **Clone the repository**
   ```
   git clone https://github.com/yourusername/upv-calendar.git
   cd upv-calendar
   ```

2. **Install dependencies**
   ```
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**
   - Create a `.env` file in the backend directory with the following content:
   ```
   PORT=3000
   PG_USER=postgres
   PG_HOST=localhost
   PG_DATABASE=upv_calendar
   PG_PASSWORD=your_pg_password
   PG_PORT=5432
   MONGO_URI=mongodb://localhost:27017/upv_calendar
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```

4. **Initialize the database**
   ```
   # Run the seed script to populate MongoDB with sample exams
   cd backend
   npm run seed:import
   ```

5. **Start the application**
   ```
   # Start backend
   cd backend
   npm run js:dev

   # Start frontend
   cd ../frontend
   npm start
   ```

6. **Access the application**
   - Open your browser and navigate to `http://localhost:4200`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate a user
- `GET /api/auth/profile` - Get user profile (Protected)
- `POST /api/auth/calendar` - Save calendar (Protected)
- `DELETE /api/auth/calendar/:id` - Delete calendar (Protected)

### Exams
- `GET /api/exams` - Get all exams (Filterable)
- `GET /api/exams/:id` - Get exam by ID
- `GET /api/exams/filters` - Get filter options (degrees, semesters, subjects)
- `POST /api/exams` - Create exam (Protected)
- `PUT /api/exams/:id` - Update exam (Protected)
- `DELETE /api/exams/:id` - Delete exam (Protected)

## Authentication Flow

1. **Registration**
   - User submits registration details
   - Backend hashes password and creates a user in MongoDB
   - JWT token is generated and returned to the client

2. **Login**
   - User submits email and password
   - Backend verifies credentials against MongoDB
   - JWT token is generated and returned to the client

3. **Protected Routes**
   - Client includes JWT in Authorization header
   - Backend middleware validates token
   - Access granted if token is valid

4. **Token Expiration**
   - JWT tokens expire after 30 days
   - On token expiration, user is redirected to login

## License
MIT 