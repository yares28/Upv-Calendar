// Script to import exam data from ETSINFexams.txt into PostgreSQL database
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// PostgreSQL connection configuration 
// Update these values based on your PostgreSQL setup
const pool = new Pool({
  user: 'postgres',      // Update with your PostgreSQL username
  host: 'localhost',
  database: 'examdb',    // Update with your database name
  password: 'postgres',  // Update with your password
  port: 5432,
});

// Path to the exams file
const examsFilePath = path.join(__dirname, 'ETSINFexams.txt');

// Function to parse the ETSINFexams.txt file
async function parseExamsFile() {
  try {
    const data = fs.readFileSync(examsFilePath, 'utf8');
    const lines = data.split('\n').filter(line => line.trim() !== '');
    
    // Arrays to store unique records
    const subjects = new Map();  // Map to track unique subjects
    const places = new Set();    // Set of unique exam places
    
    // Array to store all exam records
    const exams = [];
    
    // Parse each line of the file
    for (const line of lines) {
      // Sample line: "FEB  2 13:30 IDIOMES INGLÉS B2 READING AND USE OF ENGLISH          - [1.5h] AULA 1.9 (OI)"
      // Parse date, time, subject info, and location
      
      // Extract date, time (starts with month abbreviation like "FEB 2 13:30")
      const dateTimeMatch = line.match(/^(\w{3})\s+(\d+)\s+(\d+):(\d+)/);
      if (!dateTimeMatch) continue;
      
      const [, monthStr, day, hour, minute] = dateTimeMatch;
      
      // Map month abbreviation to month number
      const monthMap = {
        'JAN': 1, 'FEB': 2, 'MAR': 3, 'APR': 4, 'MAY': 5, 'JUN': 6,
        'JUL': 7, 'AUG': 8, 'SEP': 9, 'OCT': 10, 'NOV': 11, 'DEC': 12
      };
      
      const month = monthMap[monthStr];
      const currentYear = new Date().getFullYear(); // Current year (adjust as needed)
      
      // Create a date string in PostgreSQL format YYYY-MM-DD
      const date = `${currentYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const time = `${hour}:${minute}`;
      
      // Extract duration (format like "[1.5h]" or "[2h]")
      const durationMatch = line.match(/\[(\d+(\.\d+)?)h\]/);
      const durationHours = durationMatch ? parseFloat(durationMatch[1]) : 1.5; // Default to 1.5 hours if not specified
      const durationMinutes = Math.round(durationHours * 60);
      
      // Extract subject information and location
      // This is tricky because format varies; simplified approach:
      const afterDateTime = line.substring(dateTimeMatch[0].length).trim();
      
      // Extract place (usually after the last occurrence of a space followed by a word with parentheses)
      const placeMatch = afterDateTime.match(/\s+([^-]+)(\([^)]+\))?$/);
      const place = placeMatch ? placeMatch[1].trim() : null;
      
      if (place) places.add(place);
      
      // Extract degree code and subject
      // This is more complex and might need adjustments based on actual data format
      const degreeCodes = ['GIINF', 'GCD', 'GIIROB', 'MUIINF', 'MUHD', 'MUCC', 'IDIOMES', 'GIINF-GADE', 'GIINF-GMAT', 'GCD-GIOI'];
      let degree = null;
      let subjectInfo = afterDateTime;
      
      if (placeMatch) {
        subjectInfo = afterDateTime.substring(0, afterDateTime.lastIndexOf(placeMatch[0])).trim();
      }
      
      // Find which degree code this exam belongs to
      for (const code of degreeCodes) {
        if (subjectInfo.includes(code)) {
          degree = code;
          break;
        }
      }
      
      // If no degree found, try to infer from context
      if (!degree) {
        // Default to GIINF if we can't determine
        degree = 'GIINF';
      }
      
      // Remove degree code from subject info if found
      if (degree && subjectInfo.includes(degree)) {
        subjectInfo = subjectInfo.replace(degree, '').trim();
      }
      
      // Extract subject code if present (usually numeric code like 11556)
      const subjectCodeMatch = subjectInfo.match(/\b(\d{5})\b/);
      const subjectCode = subjectCodeMatch ? subjectCodeMatch[1] : null;
      
      // Clean up subject name (remove duration and other metadata)
      let subjectName = subjectInfo;
      if (durationMatch) {
        subjectName = subjectName.replace(durationMatch[0], '').trim();
      }
      
      // Extract notes (often in parentheses within the subject name)
      const notesMatch = subjectName.match(/\(([^)]+)\)/);
      const notes = notesMatch ? notesMatch[1] : null;
      if (notesMatch) {
        subjectName = subjectName.replace(notesMatch[0], '').trim();
      }
      
      // Clean up extra dashes or spaces
      subjectName = subjectName.replace(/\s*-\s*/g, ' ').trim();
      
      // Extract acronym if present (often 2-4 capital letters)
      const acronymMatch = subjectName.match(/\b([A-Z]{2,4})\b/);
      const acronym = acronymMatch ? acronymMatch[1] : null;
      
      // Guess academic year and semester
      // In a real implementation, you'd have a more reliable way to determine these
      const academicYear = subjectCode ? Math.floor(parseInt(subjectCode) / 10000) : 1;
      const semester = 'A'; // Default to first semester, adjust as needed
      
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

// Function to insert data into the database
async function importDataToDatabase() {
  const client = await pool.connect();
  
  try {
    // Start a transaction
    await client.query('BEGIN');
    
    // Parse the exams file
    const { subjects, places, exams } = await parseExamsFile();
    
    console.log(`Parsed ${subjects.length} subjects, ${places.length} places, and ${exams.length} exams`);
    
    // Insert places
    const placesMap = new Map();
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
    const subjectsMap = new Map();
    for (const subject of subjects) {
      const result = await client.query(
        'INSERT INTO subjects (code, name, acronym) VALUES ($1, $2, $3) ON CONFLICT (code, name) DO UPDATE SET acronym = $3 RETURNING id',
        [subject.code, subject.name, subject.acronym]
      );
      subjectsMap.set(`${subject.code}-${subject.name}`, result.rows[0].id);
    }
    
    // Get degree IDs
    const degreesResult = await client.query('SELECT id, code FROM degrees');
    const degreesMap = new Map();
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
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
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
    console.error('Error importing data to database:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Main function
async function main() {
  try {
    await importDataToDatabase();
    console.log('Data import completed successfully');
  } catch (error) {
    console.error('Error in main execution:', error);
  } finally {
    pool.end();
  }
}

// Run the script
main(); 