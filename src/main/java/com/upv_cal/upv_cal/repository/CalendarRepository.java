package com.upv_cal.upv_cal.repository;

import com.upv_cal.upv_cal.model.Calendar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Calendar entity
 */
@Repository
public interface CalendarRepository extends JpaRepository<Calendar, Long> {

    /**
     * Find calendars by user ID
     * 
     * @param userId User ID
     * @return List of calendars
     */
    List<Calendar> findByUserId(Long userId);
}