-- Seed data for UPV Calendar application
-- This file contains initial data for testing and development

-- Insert default degrees
INSERT INTO degrees (code, name) 
VALUES 
    ('GIINF', 'Grado en Ingeniería Informática'),
    ('GCD', 'Grado en Ciencia de Datos'),
    ('GIIROB', 'Grado en Ingeniería de Robótica'),
    ('MUIINF', 'Máster Universitario en Ingeniería Informática'),
    ('MUHD', 'Máster Universitario en Humanidades Digitales'),
    ('MUCC', 'Máster Universitario en Computación en la Nube'),
    ('IDIOMES', 'Idiomas'),
    ('GIINF-GADE', 'Doble Grado en Ingeniería Informática y ADE'),
    ('GIINF-GMAT', 'Doble Grado en Ingeniería Informática y Matemáticas'),
    ('GCD-GIOI', 'Doble Grado en Ciencia de Datos e Ingeniería Industrial')
ON CONFLICT (code) DO NOTHING;

-- Insert test places
INSERT INTO places (name)
VALUES
    ('Aula 1.1'), 
    ('Aula 1.2'),
    ('Aula 2.1'),
    ('Aula 2.2'),
    ('Laboratorio Informática 1'),
    ('Laboratorio Informática 2'),
    ('Salón de Actos')
ON CONFLICT (name) DO NOTHING;

-- Insert test subjects
INSERT INTO subjects (code, name, acronym)
VALUES
    ('11534', 'Matemáticas I', 'MAT1'),
    ('11535', 'Fundamentos de Programación', 'PROG'),
    ('11536', 'Física I', 'FIS1'),
    ('11537', 'Inglés', 'ING'),
    ('11538', 'Matemáticas II', 'MAT2'),
    ('11539', 'Estructuras de Datos', 'EDD'),
    ('11540', 'Bases de Datos', 'BBDD'),
    ('11541', 'Ingeniería de Software', 'IS'),
    ('11542', 'Redes de Computadores', 'RC')
ON CONFLICT (code, name) DO NOTHING;

-- Insert test user
INSERT INTO users (name, email, password)
VALUES ('Admin User', 'admin@example.com', '$2a$10$n9mDOvPcC8SNjdgaYcTKS.t7MUw7wKdmHGZO3r1gT8jqTvwqWdxBC') -- password is 'password123'
ON CONFLICT (email) DO NOTHING;

-- Insert test exams (simple format)
INSERT INTO exams (subject, date, start_time, end_time, location, degree, semester, notes)
VALUES 
    ('Matemáticas I', '2024-06-10', '09:00', '11:00', 'Aula 1.1', 'GIINF', 1, 'Llevar calculadora'),
    ('Fundamentos de Programación', '2024-06-12', '10:00', '12:00', 'Laboratorio Informática 1', 'GIINF', 1, 'Examen práctico'),
    ('Física I', '2024-06-15', '11:00', '13:00', 'Aula 1.2', 'GIINF', 1, 'Test y problemas'),
    ('Inglés', '2024-06-18', '14:00', '16:00', 'Aula 1.3', 'GIINF', 1, 'Prueba escrita y listening'),
    ('Fundamentos de Programación', '2024-06-14', '09:30', '11:30', 'Laboratorio Informática 2', 'GCD', 1, 'Examen práctico')
ON CONFLICT DO NOTHING;

-- Get IDs for inserting into exam_schedule
DO $$
DECLARE
    mat1_id INTEGER;
    prog_id INTEGER;
    giinf_id INTEGER;
    aula11_id INTEGER;
    lab1_id INTEGER;
BEGIN
    -- Get subject IDs
    SELECT id INTO mat1_id FROM subjects WHERE code = '11534';
    SELECT id INTO prog_id FROM subjects WHERE code = '11535';
    
    -- Get degree ID
    SELECT id INTO giinf_id FROM degrees WHERE code = 'GIINF';
    
    -- Get place IDs
    SELECT id INTO aula11_id FROM places WHERE name = 'Aula 1.1';
    SELECT id INTO lab1_id FROM places WHERE name = 'Laboratorio Informática 1';
    
    -- Insert into exam_schedule
    INSERT INTO exam_schedule (date, start_time, end_time, duration_minutes, subject_id, degree_id, year, semester, place_id, professor, notes)
    VALUES 
        ('2024-06-10', '09:00', '11:00', 120, mat1_id, giinf_id, 1, 'A', aula11_id, 'Dr. García', 'Llevar calculadora'),
        ('2024-06-12', '10:00', '12:00', 120, prog_id, giinf_id, 1, 'A', lab1_id, 'Dr. Pérez', 'Examen práctico')
    ON CONFLICT DO NOTHING;
END $$; 