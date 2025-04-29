package com.upv_cal.upv_cal.service;

import com.upv_cal.upv_cal.model.Calendar;
import java.util.List;

/**
 * Service interface for calendar management
 */
public interface CalendarService {

    /**
     * Find calendar by ID
     * 
     * @param id Calendar ID
     * @return Calendar if found, null otherwise
     */
    Calendar findById(Long id);

    /**
     * Find calendars by user ID
     * 
     * @param userId User ID
     * @return List of calendars
     */
    List<Calendar> findByUserId(Long userId);

    /**
     * Create a new calendar
     * 
     * @param calendar Calendar information
     * @return Created calendar with ID
     */
    Calendar createCalendar(Calendar calendar);

    /**
     * Update an existing calendar
     * 
     * @param calendar Calendar with updated information
     * @return Updated calendar
     */
    Calendar updateCalendar(Calendar calendar);

    /**
     * Delete a calendar
     * 
     * @param id Calendar ID
     */
    void deleteCalendar(Long id);
}