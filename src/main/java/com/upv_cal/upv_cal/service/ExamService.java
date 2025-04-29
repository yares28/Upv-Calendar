package com.upv_cal.upv_cal.service;

import com.upv_cal.upv_cal.model.Exam;
import java.util.List;
import java.util.Map;

/**
 * Service interface for exam management
 */
public interface ExamService {

    /**
     * Find all exams
     * 
     * @return List of exams
     */
    List<Exam> findAll();

    /**
     * Find exam by ID
     * 
     * @param id Exam ID
     * @return Exam if found, null otherwise
     */
    Exam findById(Long id);

    /**
     * Find exams with filters
     * 
     * @param filters Map of filter criteria
     * @return Filtered list of exams
     */
    List<Exam> findWithFilters(Map<String, String> filters);
}