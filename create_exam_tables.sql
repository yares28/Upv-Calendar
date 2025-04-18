-- PostgreSQL normalized schema for UPV Exam Calendar
-- This schema stores data from ETSINFexams.txt in a normalized form

-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS exam_schedule CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS degrees CASCADE;
DROP TABLE IF EXISTS places CASCADE;

-- Create table for degrees
CREATE TABLE degrees (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,  -- Degree code (e.g., GIINF, GCD, MUIINF)
    name VARCHAR(100) NOT NULL         -- Full degree name
);

-- Create table for subjects
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) NOT NULL,        -- Subject code (e.g., 11556, 14000)
    name VARCHAR(200) NOT NULL,       -- Full subject name
    acronym VARCHAR(10),              -- Subject acronym (e.g., IPC, MAD)
    UNIQUE(code, name)
);

-- Create table for places
CREATE TABLE places (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) UNIQUE NOT NULL  -- Exam location
);

-- Create table for exam schedule
CREATE TABLE exam_schedule (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,                -- Exam date
    start_time TIME NOT NULL,          -- Start time
    duration_minutes INTEGER NOT NULL, -- Duration in minutes
    subject_id INTEGER NOT NULL REFERENCES subjects(id),
    degree_id INTEGER NOT NULL REFERENCES degrees(id),
    year SMALLINT NOT NULL,            -- Academic year (1-5)
    semester CHAR(1) NOT NULL,         -- Semester (A or B)
    place_id INTEGER REFERENCES places(id),
    notes TEXT,                        -- Additional comments/notes
    
    -- Create an index on date for efficient calendar filtering
    CONSTRAINT valid_year CHECK (year BETWEEN 1 AND 5),
    CONSTRAINT valid_semester CHECK (semester IN ('A', 'B'))
);

-- Create index on common search fields
CREATE INDEX idx_exam_date ON exam_schedule(date);
CREATE INDEX idx_exam_degree ON exam_schedule(degree_id);
CREATE INDEX idx_exam_semester ON exam_schedule(semester);
CREATE INDEX idx_exam_subject ON exam_schedule(subject_id);

-- Insert initial degree data based on ETSINFexams.txt
INSERT INTO degrees (code, name) VALUES
('GIINF', 'Grado en Ingeniería Informática'),
('GCD', 'Grado en Ciencia de Datos'),
('GIIROB', 'Grado en Ingeniería de Robótica y Sistemas Digitales'),
('GIINF-GADE', 'Doble Grado en Ingeniería Informática y Administración de Empresas'),
('GIINF-GMAT', 'Doble Grado en Ingeniería Informática y Matemáticas'),
('GCD-GIOI', 'Doble Grado en Ciencia de Datos e Ingeniería de Organización Industrial'),
('MUIINF', 'Máster Universitario en Ingeniería Informática'),
('MUHD', 'Máster Universitario en Humanidades Digitales'),
('MUCC', 'Máster Universitario en Ciberseguridad y Ciberinteligencia'),
('IDIOMES', 'Formación en Idiomas');

-- Import data function (to be used later with a script)
COMMENT ON TABLE exam_schedule IS 'Contains the schedule information for all exams';
COMMENT ON TABLE subjects IS 'Contains all academic subjects';
COMMENT ON TABLE degrees IS 'Contains all academic degrees';
COMMENT ON TABLE places IS 'Contains exam locations'; 