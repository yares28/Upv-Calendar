// Script to import exam data from ETSINFexams.txt into PostgreSQL database
import * as fs from 'fs';
import * as path from 'path';
import { Pool, PoolClient } from 'pg';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Define interfaces for our data models
interface Subject {
  code: string;
  name: string;
  acronym: string | null;
}

interface Exam {
  date: string;
  startTime: string;
  durationMinutes: number;
  subjectKey: string;
  degree: string;
  year: number;
  semester: string;
  place: string | null;
  notes: string | null;
}

interface ParsedData {
  subjects: Subject[];
  places: string[];
  exams: Exam[];
}

// PostgreSQL connection configuration
const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'examdb',
  password: process.env.PG_PASSWORD || 'postgres',
  port: parseInt(process.env.PG_PORT || '5432'),
});

// Path to the exams file - updated to resolve correctly
const examsFilePath = path.join(__dirname, '../ETSINFexams.txt');

/**
 * Parse the ETSINFexams.txt file and extract exam data
 * @returns Object containing parsed subjects, places, and exams
 */
async function parseExamsFile(): Promise<ParsedData> {
  try {
    const data = fs.readFileSync(examsFilePath, 'utf8');
    const lines = data.split('\n').filter(line => line.trim() !== '');
    
    // Maps and Sets to store unique records
    const subjects = new Map<string, Subject>();
    const places = new Set<string>();
    
    // Array to store all exam records
    const exams: Exam[] = [];
    
    // Define degree codes for identification
    const degreeCodes = ['GIINF', 'GCD', 'GIIROB', 'MUIINF', 'MUHD', 'MUCC', 'IDIOMES', 'GIINF-GADE', 'GIINF-GMAT', 'GCD-GIOI'];
    
    // Parse each line of the file
    for (const line of lines) {
      // Extract date and time (format: "FEB  2 13:30")
      const dateTimeMatch = line.match(/^(\w{3})\s+(\d+)\s+(\d+):(\d+)/);
      if (!dateTimeMatch) continue;
      
      const [, monthStr, day, hour, minute] = dateTimeMatch;
      
      // Map month abbreviation to month number
      const monthMap: Record<string, number> = {
        'JAN': 1, 'FEB': 2, 'MAR': 3, 'APR': 4, 'MAY': 5, 'JUN': 6,
        'JUL': 7, 'AUG': 8, 'SEP': 9, 'OCT': 10, 'NOV': 11, 'DEC': 12
      };
      
      const month = monthMap[monthStr];
      if (!month) continue; // Skip if invalid month
      
      const currentYear = new Date().getFullYear();
      
      // Create a date string in PostgreSQL format YYYY-MM-DD
      const date = `${currentYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const time = `${hour}:${minute}`;
      
      // Extract duration (format: "[1.5h]" or "[2h]")
      const durationMatch = line.match(/\[(\d+(\.\d+)?)h\]/);
      const durationHours = durationMatch ? parseFloat(durationMatch[1]) : 1.5;
      const durationMinutes = Math.round(durationHours * 60);
      
      // Extract remaining information after date/time
      const afterDateTime = line.substring(dateTimeMatch[0].length).trim();
      
      // Extract place (usually at the end of the line)
      const placeMatch = afterDateTime.match(/\s+([^-]+)(\([^)]+\))?$/);
      const place = placeMatch ? placeMatch[1].trim() : null;
      
      if (place) places.add(place);
      
      // Extract degree and subject information
      let degree: string | null = null;
      let subjectInfo = afterDateTime;
      
      if (placeMatch) {
        subjectInfo = afterDateTime.substring(0, afterDateTime.lastIndexOf(placeMatch[0])).trim();
      }
      
      // Determine degree code
      for (const code of degreeCodes) {
        if (subjectInfo.includes(code)) {
          degree = code;
          break;
        }
      }
      
      // Default to GIINF if degree not found
      if (!degree) {
        degree = 'GIINF';
      }
      
      // Remove degree code from subject info
      if (degree && subjectInfo.includes(degree)) {
        subjectInfo = subjectInfo.replace(degree, '').trim();
      }
      
      // Extract subject code if present (usually 5 digits)
      const subjectCodeMatch = subjectInfo.match(/\b(\d{5})\b/);
      const subjectCode = subjectCodeMatch ? subjectCodeMatch[1] : null;
      
      // Clean up subject name
      let subjectName = subjectInfo;
      if (durationMatch) {
        subjectName = subjectName.replace(durationMatch[0], '').trim();
      }
      
      // Extract notes in parentheses
      const notesMatch = subjectName.match(/\(([^)]+)\)/);
      const notes = notesMatch ? notesMatch[1] : null;
      if (notesMatch) {
        subjectName = subjectName.replace(notesMatch[0], '').trim();
      }
      
      // Clean up extra dashes or spaces
      subjectName = subjectName.replace(/\s*-\s*/g, ' ').trim();
      
      // Extract acronym if present (2-4 capital letters)
      const acronymMatch = subjectName.match(/\b([A-Z]{2,4})\b/);
      const acronym = acronymMatch ? acronymMatch[1] : null;
      
      // Determine academic year and semester
      const academicYear = subjectCode ? Math.floor(parseInt(subjectCode) / 10000) : 1;
      const semester = 'A'; // Default to first semester
      
      // Store subject if not already stored
      const subjectKey = `${subjectCode || ''}-${subjectName}`;
      if (!subjects.has(subjectKey)) {
        subjects.set(subjectKey, {
          code: subjectCode || subjectName.substring(0, 10),
          name: subjectName,
          acronym: acronym
        });
      }
      
      // Create exam record
      exams.push({
        date,
        startTime: time,
        durationMinutes,
        subjectKey,
        degree,
        year: academicYear,
        semester,
        place,
        notes
      });
    }
    
    return {
      subjects: Array.from(subjects.values()),
      places: Array.from(places),
      exams
    };
    
  } catch (error) {
    console.error('Error parsing exams file:', error);
    throw error;
  }
}

/**
 * Import parsed data into PostgreSQL database
 */
async function importDataToDatabase(): Promise<void> {
  const client: PoolClient = await pool.connect();
  
  try {
    // Start a transaction
    await client.query('BEGIN');
    
    // Parse the exams file
    const { subjects, places, exams } = await parseExamsFile();
    
    console.log(`Parsed ${subjects.length} subjects, ${places.length} places, and ${exams.length} exams`);
    
    // Insert places
    const placesMap = new Map<string, number>();
    for (const place of places) {
      if (place) {
        const result = await client.query(
          'INSERT INTO places (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = $1 RETURNING id',
          [place]
        );
        placesMap.set(place, result.rows[0].id);
      }
    }
    
    // Insert subjects
    const subjectsMap = new Map<string, number>();
    for (const subject of subjects) {
      const result = await client.query(
        'INSERT INTO subjects (code, name, acronym) VALUES ($1, $2, $3) ON CONFLICT (code, name) DO UPDATE SET acronym = $3 RETURNING id',
        [subject.code, subject.name, subject.acronym]
      );
      subjectsMap.set(`${subject.code}-${subject.name}`, result.rows[0].id);
    }
    
    // Get degree IDs
    const degreesResult = await client.query('SELECT id, code FROM degrees');
    const degreesMap = new Map<string, number>();
    degreesResult.rows.forEach(row => degreesMap.set(row.code, row.id));
    
    // Insert exams
    for (const exam of exams) {
      const subjectId = subjectsMap.get(`${exam.subjectKey}`);
      const degreeId = degreesMap.get(exam.degree);
      const placeId = exam.place ? placesMap.get(exam.place) : null;
      
      if (!subjectId || !degreeId) {
        console.warn(`Missing subject or degree for exam: ${JSON.stringify(exam)}`);
        continue;
      }
      
      await client.query(
        `INSERT INTO exam_schedule 
         (date, start_time, duration_minutes, subject_id, degree_id, year, semester, place_id, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (date, start_time, subject_id, degree_id) 
         DO UPDATE SET 
           duration_minutes = $3,
           year = $6,
           semester = $7,
           place_id = $8,
           notes = $9`,
        [
          exam.date, 
          exam.startTime, 
          exam.durationMinutes,
          subjectId,
          degreeId,
          exam.year,
          exam.semester,
          placeId,
          exam.notes
        ]
      );
    }
    
    // Commit the transaction
    await client.query('COMMIT');
    console.log('Successfully imported all exam data');
    
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query('ROLLBACK');
    console.error('Error importing data to database:', error instanceof Error ? error.message : String(error));
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Main function to run the import process
 */
async function main(): Promise<void> {
  try {
    console.log('Starting exam data import...');
    await importDataToDatabase();
    console.log('Import completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Import failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// Run the main function
main(); 