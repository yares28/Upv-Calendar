package com.upv_cal.upv_cal.util;

import com.upv_cal.upv_cal.model.Exam;
import com.upv_cal.upv_cal.repository.ExamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Data loader to import exam data at application startup
 */
@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private ExamRepository examRepository;

    @Override
    public void run(String... args) throws Exception {
        // Check if exams already exist
        if (examRepository.count() > 0) {
            System.out.println("Exams already loaded. Skipping import.");
            return;
        }

        // Import exam data from file
        importExamData();
    }

    /**
     * Import exam data from file
     */
    private void importExamData() {
        File file = new File("ETSINFexams.txt");
        if (!file.exists()) {
            System.out.println("Exam data file not found: " + file.getAbsolutePath());
            return;
        }

        List<Exam> exams = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = reader.readLine()) != null) {
                // Skip header or empty lines
                if (line.trim().isEmpty() || line.startsWith("#")) {
                    continue;
                }

                // Parse exam data
                String[] parts = line.split("\\|");
                if (parts.length >= 6) {
                    Exam exam = new Exam();
                    exam.setSubject(parts[0].trim());
                    exam.setDate(parts[1].trim());
                    exam.setTime(parts[2].trim());
                    exam.setLocation(parts[3].trim());
                    exam.setDegree(parts[4].trim());
                    exam.setSemester(Integer.parseInt(parts[5].trim()));
                    if (parts.length > 6) {
                        exam.setNotes(parts[6].trim());
                    }

                    exams.add(exam);
                }
            }

            // Save exams to database
            examRepository.saveAll(exams);
            System.out.println("Imported " + exams.size() + " exams.");

        } catch (IOException e) {
            System.err.println("Error importing exam data: " + e.getMessage());
        } catch (NumberFormatException e) {
            System.err.println("Error parsing semester value: " + e.getMessage());
        }
    }
}