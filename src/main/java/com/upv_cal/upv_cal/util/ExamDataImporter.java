package com.upv_cal.upv_cal.util;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.time.LocalDate;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Utility class for importing exam data from ETSINFexams.txt into the database
 */
@Component
public class ExamDataImporter implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Data class for Subject information
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    private static class Subject {
        private String code;
        private String name;
        private String acronym;
    }

    /**
     * Data class for Exam information
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    private static class Exam {
        private String date;
        private String startTime;
        private int durationMinutes;
        private String subjectKey;
        private String degree;
        private int year;
        private String semester;
        private String place;
        private String notes;
    }

    /**
     * Data class for parsed data results
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    private static class ParsedData {
        private List<Subject> subjects;
        private List<String> places;
        private List<Exam> exams;
    }

    @Override
    public void run(String... args) throws Exception {
        // Check if there's a command-line argument to trigger import
        for (String arg : args) {
            if (arg.equals("--import-exams")) {
                importDataToDatabase();
                return;
            }
        }
    }

    /**
     * Parse the ETSINFexams.txt file and extract exam data
     * 
     * @return Object containing parsed subjects, places, and exams
     */
    private ParsedData parseExamsFile() throws IOException {
        File examsFile = new File("ETSINFexams.txt");

        Map<String, Subject> subjects = new HashMap<>();
        Set<String> places = new HashSet<>();
        List<Exam> exams = new ArrayList<>();

        // Define degree codes for identification
        List<String> degreeCodes = Arrays.asList(
                "GIINF", "GCD", "GIIROB", "MUIINF", "MUHD", "MUCC",
                "IDIOMES", "GIINF-GADE", "GIINF-GMAT", "GCD-GIOI");

        // Map month abbreviation to month number
        Map<String, Integer> monthMap = new HashMap<>();
        monthMap.put("JAN", 1);
        monthMap.put("FEB", 2);
        monthMap.put("MAR", 3);
        monthMap.put("APR", 4);
        monthMap.put("MAY", 5);
        monthMap.put("JUN", 6);
        monthMap.put("JUL", 7);
        monthMap.put("AUG", 8);
        monthMap.put("SEP", 9);
        monthMap.put("OCT", 10);
        monthMap.put("NOV", 11);
        monthMap.put("DEC", 12);

        // Regex patterns
        Pattern dateTimePattern = Pattern.compile("^(\\w{3})\\s+(\\d+)\\s+(\\d+):(\\d+)");
        Pattern durationPattern = Pattern.compile("\\[(\\d+(\\.\\d+)?)h\\]");
        Pattern placePattern = Pattern.compile("\\s+([^-]+)(\\([^)]+\\))?$");
        Pattern subjectCodePattern = Pattern.compile("\\b(\\d{5})\\b");
        Pattern notesPattern = Pattern.compile("\\(([^)]+)\\)");
        Pattern acronymPattern = Pattern.compile("\\b([A-Z]{2,4})\\b");

        try (BufferedReader reader = new BufferedReader(new FileReader(examsFile))) {
            String line;
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                if (line.isEmpty()) {
                    continue;
                }

                // Extract date and time (format: "FEB 2 13:30")
                Matcher dateTimeMatcher = dateTimePattern.matcher(line);
                if (!dateTimeMatcher.find()) {
                    continue;
                }

                String monthStr = dateTimeMatcher.group(1);
                String day = dateTimeMatcher.group(2);
                String hour = dateTimeMatcher.group(3);
                String minute = dateTimeMatcher.group(4);

                Integer month = monthMap.get(monthStr);
                if (month == null) {
                    continue; // Skip if invalid month
                }

                int currentYear = LocalDate.now().getYear();

                // Create a date string in PostgreSQL format YYYY-MM-DD
                String date = String.format("%d-%02d-%02d", currentYear, month, Integer.parseInt(day));
                String time = hour + ":" + minute;

                // Extract duration (format: "[1.5h]" or "[2h]")
                Matcher durationMatcher = durationPattern.matcher(line);
                double durationHours = durationMatcher.find() ? Double.parseDouble(durationMatcher.group(1)) : 1.5;
                int durationMinutes = (int) Math.round(durationHours * 60);

                // Extract remaining information after date/time
                String afterDateTime = line.substring(dateTimeMatcher.end()).trim();

                // Extract place (usually at the end of the line)
                Matcher placeMatcher = placePattern.matcher(afterDateTime);
                String place = null;
                if (placeMatcher.find()) {
                    place = placeMatcher.group(1).trim();
                    places.add(place);
                }

                // Extract degree and subject information
                String degree = null;
                String subjectInfo = afterDateTime;

                if (placeMatcher.find()) {
                    subjectInfo = afterDateTime.substring(0, afterDateTime.lastIndexOf(placeMatcher.group())).trim();
                }

                // Determine degree code
                for (String code : degreeCodes) {
                    if (subjectInfo.contains(code)) {
                        degree = code;
                        break;
                    }
                }

                // Default to GIINF if degree not found
                if (degree == null) {
                    degree = "GIINF";
                }

                // Remove degree code from subject info
                if (degree != null && subjectInfo.contains(degree)) {
                    subjectInfo = subjectInfo.replace(degree, "").trim();
                }

                // Extract subject code if present (usually 5 digits)
                Matcher subjectCodeMatcher = subjectCodePattern.matcher(subjectInfo);
                String subjectCode = subjectCodeMatcher.find() ? subjectCodeMatcher.group(1) : null;

                // Clean up subject name
                String subjectName = subjectInfo;
                if (durationMatcher.find(0)) {
                    subjectName = subjectName.replace(durationMatcher.group(), "").trim();
                }

                // Extract notes in parentheses
                Matcher notesMatcher = notesPattern.matcher(subjectName);
                String notes = notesMatcher.find() ? notesMatcher.group(1) : null;
                if (notes != null) {
                    subjectName = subjectName.replace(notesMatcher.group(), "").trim();
                }

                // Clean up extra dashes or spaces
                subjectName = subjectName.replaceAll("\\s*-\\s*", " ").trim();

                // Extract acronym if present (2-4 capital letters)
                Matcher acronymMatcher = acronymPattern.matcher(subjectName);
                String acronym = acronymMatcher.find() ? acronymMatcher.group(1) : null;

                // Determine academic year and semester
                int academicYear = subjectCode != null ? Integer.parseInt(subjectCode) / 10000 : 1;
                String semester = "A"; // Default to first semester

                // Store subject if not already stored
                String subjectKey = (subjectCode != null ? subjectCode : "") + "-" + subjectName;
                if (!subjects.containsKey(subjectKey)) {
                    Subject subject = new Subject();
                    subject.setCode(subjectCode != null ? subjectCode
                            : subjectName.substring(0, Math.min(10, subjectName.length())));
                    subject.setName(subjectName);
                    subject.setAcronym(acronym);
                    subjects.put(subjectKey, subject);
                }

                // Create exam record
                Exam exam = new Exam();
                exam.setDate(date);
                exam.setStartTime(time);
                exam.setDurationMinutes(durationMinutes);
                exam.setSubjectKey(subjectKey);
                exam.setDegree(degree);
                exam.setYear(academicYear);
                exam.setSemester(semester);
                exam.setPlace(place);
                exam.setNotes(notes);

                exams.add(exam);
            }
        }

        return new ParsedData(new ArrayList<>(subjects.values()), new ArrayList<>(places), exams);
    }

    /**
     * Import parsed data into the database
     */
    public void importDataToDatabase() {
        try {
            // Check if exams already exist in the database
            Integer existingExamCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM exams", Integer.class);
            if (existingExamCount != null && existingExamCount > 0) {
                System.out.println("Exams already exist in the database. Skipping import.");
                return;
            }

            // Parse the exams file
            ParsedData parsedData = parseExamsFile();

            System.out.printf("Parsed %d subjects, %d places, and %d exams%n",
                    parsedData.getSubjects().size(),
                    parsedData.getPlaces().size(),
                    parsedData.getExams().size());

            // Begin transaction
            jdbcTemplate.execute("BEGIN");

            // Insert places
            Map<String, Integer> placesMap = new HashMap<>();
            for (String place : parsedData.getPlaces()) {
                if (place != null && !place.isEmpty()) {
                    Integer placeId = jdbcTemplate.queryForObject(
                            "INSERT INTO places (name) VALUES (?) ON CONFLICT (name) DO UPDATE SET name = ? RETURNING id",
                            Integer.class, place, place);
                    placesMap.put(place, placeId);
                }
            }

            // Insert subjects
            Map<String, Integer> subjectsMap = new HashMap<>();
            for (Subject subject : parsedData.getSubjects()) {
                Integer subjectId = jdbcTemplate.queryForObject(
                        "INSERT INTO subjects (code, name, acronym) VALUES (?, ?, ?) ON CONFLICT (code, name) DO UPDATE SET acronym = ? RETURNING id",
                        Integer.class, subject.getCode(), subject.getName(), subject.getAcronym(),
                        subject.getAcronym());
                subjectsMap.put(subject.getCode() + "-" + subject.getName(), subjectId);
            }

            // Get degree IDs
            Map<String, Integer> degreesMap = new HashMap<>();
            jdbcTemplate.query("SELECT id, code FROM degrees", rs -> {
                degreesMap.put(rs.getString("code"), rs.getInt("id"));
            });

            // Insert exams
            int importedExamCount = 0;
            for (Exam exam : parsedData.getExams()) {
                Integer subjectId = subjectsMap.get(exam.getSubjectKey());
                Integer degreeId = degreesMap.get(exam.getDegree());
                Integer placeId = exam.getPlace() != null ? placesMap.get(exam.getPlace()) : null;

                if (subjectId == null || degreeId == null) {
                    System.out.printf("Missing subject or degree for exam: %s%n", exam);
                    continue;
                }

                jdbcTemplate.update(
                        "INSERT INTO exam_schedule " +
                                "(date, start_time, duration_minutes, subject_id, degree_id, year, semester, place_id, notes) "
                                +
                                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) " +
                                "ON CONFLICT (date, start_time, subject_id, degree_id) " +
                                "DO UPDATE SET duration_minutes = ?, year = ?, semester = ?, place_id = ?, notes = ?",
                        exam.getDate(), exam.getStartTime(), exam.getDurationMinutes(),
                        subjectId, degreeId, exam.getYear(), exam.getSemester(), placeId, exam.getNotes(),
                        exam.getDurationMinutes(), exam.getYear(), exam.getSemester(), placeId, exam.getNotes());

                importedExamCount++;
            }

            // Commit transaction
            jdbcTemplate.execute("COMMIT");

            System.out.printf("Successfully imported %d exams%n", importedExamCount);

        } catch (Exception e) {
            // Rollback transaction on error
            jdbcTemplate.execute("ROLLBACK");
            System.err.println("Error importing exam data: " + e.getMessage());
            e.printStackTrace();
        }
    }
}