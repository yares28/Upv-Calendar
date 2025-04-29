-- Database schema for UPV Calendar application
-- This file creates all necessary tables for the application

-- Drop tables if they exist (for clean rebuild)
DROP TABLE IF EXISTS exam_schedule;
DROP TABLE IF EXISTS exams;
DROP TABLE IF EXISTS calendars;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS places;
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS degrees;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create degrees table
CREATE TABLE degrees (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL
);

-- Create subjects table
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    acronym VARCHAR(10),
    UNIQUE (code, name)
);

-- Create places table
CREATE TABLE places (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Create exams table (simpler version)
CREATE TABLE exams (
    id SERIAL PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    degree VARCHAR(50) NOT NULL,
    semester INT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create exam_schedule table (more detailed exam information)
CREATE TABLE exam_schedule (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 90,
    subject_id INT NOT NULL,
    degree_id INT NOT NULL,
    year INT NOT NULL,
    semester VARCHAR(1) NOT NULL,
    place_id INT,
    professor VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (degree_id) REFERENCES degrees(id),
    FOREIGN KEY (place_id) REFERENCES places(id),
    UNIQUE (date, start_time, subject_id, degree_id)
);

-- Create calendars table for saved user calendars
CREATE TABLE calendars (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    filters JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes for performance
CREATE INDEX idx_exam_date ON exams(date);
CREATE INDEX idx_exam_degree ON exams(degree);
CREATE INDEX idx_exam_semester ON exams(semester);
CREATE INDEX idx_exam_schedule_date ON exam_schedule(date);
CREATE INDEX idx_exam_schedule_subject ON exam_schedule(subject_id);
CREATE INDEX idx_calendars_user ON calendars(user_id); 