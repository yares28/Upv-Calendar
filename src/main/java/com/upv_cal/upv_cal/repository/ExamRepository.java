package com.upv_cal.upv_cal.repository;

import com.upv_cal.upv_cal.model.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Exam entity
 */
@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {

    /**
     * Find exams by subject (containing the given string, case insensitive)
     * 
     * @param subject Subject name
     * @return List of matching exams
     */
    List<Exam> findBySubjectContainingIgnoreCase(String subject);

    /**
     * Find exams by degree
     * 
     * @param degree Degree name
     * @return List of matching exams
     */
    List<Exam> findByDegree(String degree);

    /**
     * Find exams by semester
     * 
     * @param semester Semester number
     * @return List of matching exams
     */
    List<Exam> findBySemester(Integer semester);

    /**
     * Find exams by date
     * 
     * @param date Exam date
     * @return List of matching exams
     */
    List<Exam> findByDate(String date);
}