package com.upv_cal.upv_cal.controller;

import com.upv_cal.upv_cal.model.Exam;
import com.upv_cal.upv_cal.service.ExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller for exam-related endpoints
 */
@RestController
@RequestMapping("/api")
@CrossOrigin
public class ExamController {

    @Autowired
    private ExamService examService;

    /**
     * Get all exams
     * 
     * @return List of exams
     */
    @GetMapping("/exams")
    public ResponseEntity<List<Exam>> getAllExams() {
        List<Exam> exams = examService.findAll();
        return ResponseEntity.ok(exams);
    }

    /**
     * Get exams with filters
     * 
     * @param filters Map of filter criteria
     * @return Filtered list of exams
     */
    @GetMapping("/exams/filter")
    public ResponseEntity<List<Exam>> getFilteredExams(@RequestParam Map<String, String> filters) {
        List<Exam> exams = examService.findWithFilters(filters);
        return ResponseEntity.ok(exams);
    }

    /**
     * Get exam by ID
     * 
     * @param id Exam ID
     * @return Exam if found
     */
    @GetMapping("/exams/{id}")
    public ResponseEntity<Exam> getExamById(@PathVariable Long id) {
        if (id == null) {
            return ResponseEntity.badRequest().build();
        }

        Exam exam = examService.findById(id);
        if (exam == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(exam);
    }
}