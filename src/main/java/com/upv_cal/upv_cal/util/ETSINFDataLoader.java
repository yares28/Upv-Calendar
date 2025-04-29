package com.upv_cal.upv_cal.util;

import com.upv_cal.upv_cal.model.Exam;
import com.upv_cal.upv_cal.repository.ExamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Utility for importing data from ETSINFexams.txt file.
 * This class provides a cleaner approach to parse the tab-delimited format.
 */
@Component
public class ETSINFDataLoader implements CommandLineRunner {

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        // This will run automatically when the application starts
        // You can add logic to check if import should be performed
        for (String arg : args) {
            if (arg.equals("--import-exams")) {
                importExams();
                return;
            }
        }
    }

    /**
     * Manually triggered method to import exams
     */
    @Transactional
    public void importExams() {
        // Check if exams already exist
        if (examRepository.count() > 0) {
            System.out.println("Exams already exist in the database. Skipping import.");
            return;
        }

        // Ensure the table exists before importing
        ensureTablesExist();

        System.out.println("Starting import from ETSINFexams.txt file...");

        try {
            List<Exam> exams = parseExamsFile();
            if (exams.isEmpty()) {
                System.out.println("No exams found to import.");
                return;
            }

            // Save exams to database
            examRepository.saveAll(exams);
            System.out.println("Successfully imported " + exams.size() + " exams.");

        } catch (IOException e) {
            System.err.println("Error reading file: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Error during import: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Parse the ETSINFexams.txt file and extract exam data
     * 
     * @return List of Exam entities
     */
    private List<Exam> parseExamsFile() throws IOException {
        File file = new File("ETSINFexams.txt");
        if (!file.exists()) {
            System.out.println("File not found: " + file.getAbsolutePath());
            return Collections.emptyList();
        }

        List<Exam> exams = new ArrayList<>();
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        boolean headerProcessed = false;

        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;

            // Process all lines
            while ((line = reader.readLine()) != null) {
                if (line.trim().isEmpty()) {
                    continue;
                }

                // Skip the header line
                if (!headerProcessed) {
                    headerProcessed = true;
                    continue;
                }

                // Split line by tabs
                String[] fields = line.split("\\t");

                // If we don't have enough fields, skip this line
                if (fields.length < 7) {
                    System.out.println("Warning: Skipping line with insufficient data: " + line);
                    continue;
                }

                try {
                    /*
                     * Expected format from ETSINFexams.txt:
                     * Date | Time | Duration | Code | Subject | Acronym | Degree | Year | Semester
                     * | Place | Comment
                     * e.g. 26/09/2024 08:00 30 11604 Business models and company functional areas
                     * MNE GIINF 4 A ETS DE INGENIERÍA INFORMÁTICA 1 parcial online
                     */

                    // Parse fields
                    String date = fields[0].trim();
                    String time = fields[1].trim();
                    String subject = fields[4].trim();
                    String degree = fields[6].trim();

                    // Parse semester - the file uses letters (A, B) for semesters, but our model
                    // expects integers
                    int semester = 1; // Default to first semester
                    if (fields.length > 8 && fields[8].trim().equals("B")) {
                        semester = 2; // B means second semester
                    }

                    // Get location
                    String location = fields.length > 9 ? fields[9].trim() : "Unknown";

                    // Get notes/comments if available
                    String notes = fields.length > 10 ? fields[10].trim() : null;

                    // Create and populate Exam entity
                    Exam exam = new Exam();
                    exam.setSubject(subject);
                    exam.setDate(date);
                    exam.setTime(time);
                    exam.setLocation(location);
                    exam.setDegree(degree);
                    exam.setSemester(semester);
                    exam.setNotes(notes);

                    exams.add(exam);

                } catch (Exception e) {
                    System.out.println("Error parsing line: " + line);
                    System.out.println("Error details: " + e.getMessage());
                }
            }
        }

        return exams;
    }

    /**
     * Creates the necessary database tables if they don't exist
     */
    private void ensureTablesExist() {
        // Check if exams table exists
        try {
            jdbcTemplate.queryForObject("SELECT COUNT(*) FROM exams", Integer.class);
        } catch (Exception e) {
            // Table doesn't exist, create it
            jdbcTemplate.execute(
                    "CREATE TABLE IF NOT EXISTS exams (" +
                            "id SERIAL PRIMARY KEY, " +
                            "subject VARCHAR(255) NOT NULL, " +
                            "date VARCHAR(20) NOT NULL, " +
                            "time VARCHAR(10) NOT NULL, " +
                            "location VARCHAR(255) NOT NULL, " +
                            "degree VARCHAR(50) NOT NULL, " +
                            "semester INT NOT NULL, " +
                            "notes VARCHAR(500)" +
                            ")");
            System.out.println("Created exams table");
        }
    }
}