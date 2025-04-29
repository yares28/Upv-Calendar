package com.upv_cal.upv_cal.controller;

import com.upv_cal.upv_cal.util.ETSINFDataLoader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller for data import operations
 */
@RestController
@RequestMapping("/api/import")
public class ImportController {

    @Autowired
    private ETSINFDataLoader dataLoader;

    /**
     * Endpoint to import exam data from ETSINFexams.txt file
     * 
     * @return Import result
     */
    @PostMapping("/exams")
    public ResponseEntity<Map<String, Object>> importExams() {
        Map<String, Object> response = new HashMap<>();

        try {
            // Trigger the import process
            dataLoader.importExams();

            response.put("success", true);
            response.put("message", "Exam data import started. Check application logs for details.");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error importing exam data: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}