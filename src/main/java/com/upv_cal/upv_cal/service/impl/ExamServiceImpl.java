package com.upv_cal.upv_cal.service.impl;

import com.upv_cal.upv_cal.model.Exam;
import com.upv_cal.upv_cal.repository.ExamRepository;
import com.upv_cal.upv_cal.service.ExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Implementation of ExamService interface
 */
@Service
public class ExamServiceImpl implements ExamService {

    @Autowired
    private ExamRepository examRepository;

    @Override
    public List<Exam> findAll() {
        return examRepository.findAll();
    }

    @Override
    public Exam findById(Long id) {
        return examRepository.findById(id).orElse(null);
    }

    @Override
    public List<Exam> findWithFilters(Map<String, String> filters) {
        List<Exam> allExams = examRepository.findAll();

        // Apply filters if any
        if (filters != null && !filters.isEmpty()) {
            return allExams.stream()
                    .filter(exam -> matchesFilters(exam, filters))
                    .collect(Collectors.toList());
        }

        return allExams;
    }

    /**
     * Check if an exam matches the provided filters
     * 
     * @param exam    Exam to check
     * @param filters Map of filter criteria
     * @return True if exam matches all filters
     */
    private boolean matchesFilters(Exam exam, Map<String, String> filters) {
        for (Map.Entry<String, String> entry : filters.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();

            if (value == null || value.isEmpty()) {
                continue;
            }

            switch (key) {
                case "subject":
                    if (!exam.getSubject().toLowerCase().contains(value.toLowerCase())) {
                        return false;
                    }
                    break;
                case "degree":
                    if (!exam.getDegree().equalsIgnoreCase(value)) {
                        return false;
                    }
                    break;
                case "semester":
                    try {
                        int semesterValue = Integer.parseInt(value);
                        if (exam.getSemester() != semesterValue) {
                            return false;
                        }
                    } catch (NumberFormatException e) {
                        // Invalid semester filter, ignore
                    }
                    break;
                case "date":
                    if (!exam.getDate().equals(value)) {
                        return false;
                    }
                    break;
            }
        }

        return true;
    }
}