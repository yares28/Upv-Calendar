import fs from 'fs';
import path from 'path';
import { AppDataSource, initializeDB } from '../db/config';
import { Exam, Degree, Subject, Place, ExamSchedule } from '../db/models';

// Define interfaces for data models
interface ExamData {
  subject: string;
  degree: string;
  semester: number;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  professor?: string;
  notes?: string;
}

/**
 * Parse the ETSINFexams.txt file and extract exam data
 */
async function parseExamsFile(filePath: string): Promise<ExamData[]> {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n').filter(line => line.trim() !== '');
    const exams: ExamData[] = [];
    
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
      const date = new Date(currentYear, month - 1, parseInt(day));
      const startTime = `${hour}:${minute}`;
      
      // Extract duration (format: "[1.5h]" or "[2h]")
      const durationMatch = line.match(/\[(\d+(\.\d+)?)h\]/);
      const durationHours = durationMatch ? parseFloat(durationMatch[1]) : 1.5;
      
      // Calculate end time
      const endHour = parseInt(hour) + Math.floor(durationHours);
      const endMinute = parseInt(minute) + Math.round((durationHours % 1) * 60);
      let endTime = `${endHour}:${endMinute}`;
      
      // Extract remaining information after date/time
      const afterDateTime = line.substring(dateTimeMatch[0].length).trim();
      
      // Extract place (usually at the end of the line)
      const placeMatch = afterDateTime.match(/\s+([^-]+)(\([^)]+\))?$/);
      const location = placeMatch ? placeMatch[1].trim() : 'Unknown';
      
      // Extract degree and subject information
      let degree: string = 'GIINF'; // Default degree
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
      
      // Remove degree code from subject info
      if (subjectInfo.includes(degree)) {
        subjectInfo = subjectInfo.replace(degree, '').trim();
      }
      
      // Extract subject code if present (usually 5 digits)
      const subjectCodeMatch = subjectInfo.match(/\b(\d{5})\b/);
      
      // Clean up subject name
      let subject = subjectInfo;
      if (durationMatch) {
        subject = subject.replace(durationMatch[0], '').trim();
      }
      
      // Extract notes in parentheses
      const notesMatch = subject.match(/\(([^)]+)\)/);
      const notes = notesMatch ? notesMatch[1] : null;
      if (notesMatch) {
        subject = subject.replace(notesMatch[0], '').trim();
      }
      
      // Clean up extra dashes or spaces
      subject = subject.replace(/\s*-\s*/g, ' ').trim();
      
      // Determine semester based on the month
      const semester = month >= 1 && month <= 6 ? 2 : 1;
      
      // Create exam record
      exams.push({
        subject,
        degree,
        semester,
        date,
        startTime,
        endTime,
        location,
        notes: notes || undefined
      });
    }
    
    return exams;
    
  } catch (error) {
    console.error('Error parsing exams file:', error);
    throw error;
  }
}

/**
 * Import exams data into PostgreSQL database
 */
async function importExams(): Promise<void> {
  try {
    // Initialize database connection
    await initializeDB();
    
    // Path to the exams file
    const filePath = path.join(__dirname, '../../../ETSINFexams.txt');
    
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      process.exit(1);
    }
    
    console.log(`Reading exam data from ${filePath}`);
    
    // Parse the exams file
    const exams = await parseExamsFile(filePath);
    console.log(`Parsed ${exams.length} exams`);
    
    // Get repositories
    const examRepository = AppDataSource.getRepository(Exam);
    
    // Insert exams
    let insertedCount = 0;
    
    for (const examData of exams) {
      // Check if exam already exists
      const existingExam = await examRepository.findOne({
        where: {
          subject: examData.subject,
          date: examData.date,
          startTime: examData.startTime,
          degree: examData.degree
        }
      });
      
      if (!existingExam) {
        const exam = examRepository.create(examData);
        await examRepository.save(exam);
        insertedCount++;
      }
    }
    
    console.log(`Successfully imported ${insertedCount} new exams`);
    
  } catch (error) {
    console.error('Error importing exams:', error);
    throw error;
  } finally {
    // Close database connection
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

// Run the import function
importExams()
  .then(() => {
    console.log('Import completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('Import failed:', error);
    process.exit(1);
  }); 