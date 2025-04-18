-- Database: upv_calendar

-- Drop database if it exists and create a new one
DROP DATABASE IF EXISTS upv_calendar;
CREATE DATABASE upv_calendar;

-- Connect to the database
\c upv_calendar;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- In a real app, this would be hashed
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create saved_calendars table
CREATE TABLE saved_calendars (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    degrees TEXT[], -- Store arrays of filter selections
    semesters TEXT[],
    subjects TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
-- Sample user (password is 'password123' - in a real app, this would be hashed)
INSERT INTO users (email, first_name, last_name) VALUES 
    ('user@example.com', 'Demo', 'user');

-- Update passwords (in a real app, these would be hashed with bcrypt or similar)
UPDATE users SET password = '1234';

-- Sample saved calendars
INSERT INTO saved_calendars (user_id, name, degrees, semesters, subjects) VALUES
    (1, 'CS Exams Only', ARRAY['Computer Science'], ARRAY[]::TEXT[], ARRAY['Programming', 'Databases']),
    (1, 'All Engineering', ARRAY['Engineering'], ARRAY[]::TEXT[], ARRAY[]::TEXT[]),
    (2, 'Math Focus', ARRAY['Mathematics'], ARRAY['A'], ARRAY['Mathematics']),
    (3, 'Programming', ARRAY['Computer Science'], ARRAY[]::TEXT[], ARRAY['Programming', 'Software Engineering']);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to update timestamps
CREATE TRIGGER update_users_modtime
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_saved_calendars_modtime
    BEFORE UPDATE ON saved_calendars
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Permissions (in a real app, you would create a specific user with limited permissions)
-- For demonstration purposes, we'll just make sure the tables are created properly

-- Show the schema
\dt

-- Show sample data
SELECT * FROM users;
SELECT * FROM saved_calendars;

-- Instructions for running this script:
/*
To run this script, use the following command in your terminal:

psql -f database_setup.sql

Note: You need to have PostgreSQL installed and configured on your machine.

To connect to the database after setup:
psql -d upv_calendar

Common commands:
- \dt - List all tables
- \d tablename - Show table structure
- SELECT * FROM users; - Show all users
- SELECT * FROM saved_calendars; - Show all saved calendars
*/ 