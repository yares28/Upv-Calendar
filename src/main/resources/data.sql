-- Initial data for UPV Calendar application

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

-- Insert test user if none exists
INSERT INTO users (email, password, name)
SELECT 'test@example.com', 'password123', 'Test User'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'test@example.com');

-- Insert test calendar if none exists
INSERT INTO calendars (user_id, name, filters)
SELECT u.id, 'My Calendar', '{"degrees": ["GIINF"], "semesters": [1, 2]}'
FROM users u 
WHERE u.email = 'test@example.com'
AND NOT EXISTS (SELECT 1 FROM calendars c WHERE c.user_id = u.id AND c.name = 'My Calendar');

-- Sample exams for testing (simple format)
INSERT INTO exams (subject, date, time, location, degree, semester, notes)
VALUES 
    ('Programación', '2023-06-15', '09:00', 'Aula 1.1', 'GIINF', 1, NULL),
    ('Matemática Discreta', '2023-06-16', '11:00', 'Aula 1.2', 'GIINF', 1, NULL),
    ('Bases de Datos', '2023-06-17', '09:00', 'Aula 2.1', 'GIINF', 2, 'Traer calculadora'),
    ('Inteligencia Artificial', '2023-06-18', '15:00', 'Aula 3.1', 'GIINF', 3, NULL),
    ('Análisis de Datos', '2023-06-19', '09:00', 'Aula 1.3', 'GCD', 2, NULL)
ON CONFLICT DO NOTHING; 