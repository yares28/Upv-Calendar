-- Database schema for UPV Calendar application

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255)
);

-- Create calendars table
CREATE TABLE IF NOT EXISTS calendars (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    filters JSONB,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create degrees table
CREATE TABLE IF NOT EXISTS degrees (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL
);

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    acronym VARCHAR(10),
    UNIQUE (code, name)
);

-- Create places table
CREATE TABLE IF NOT EXISTS places (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Create exams table
CREATE TABLE IF NOT EXISTS exams (
    id SERIAL PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    date VARCHAR(20) NOT NULL,
    time VARCHAR(10) NOT NULL,
    location VARCHAR(255) NOT NULL,
    degree VARCHAR(50) NOT NULL,
    semester INT NOT NULL,
    notes VARCHAR(500)
);

-- Create exam schedule table for more detailed exam information
CREATE TABLE IF NOT EXISTS exam_schedule (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 90,
    subject_id INT NOT NULL,
    degree_id INT NOT NULL,
    year INT NOT NULL,
    semester VARCHAR(1) NOT NULL,
    place_id INT,
    notes TEXT,
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (degree_id) REFERENCES degrees(id),
    FOREIGN KEY (place_id) REFERENCES places(id),
    UNIQUE (date, start_time, subject_id, degree_id)
); 