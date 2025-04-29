package com.upv_cal.upv_cal.controller;

import com.upv_cal.upv_cal.model.Calendar;
import com.upv_cal.upv_cal.service.CalendarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller for calendar-related endpoints
 */
@RestController
@RequestMapping("/api")
@CrossOrigin
public class CalendarController {

    @Autowired
    private CalendarService calendarService;

    /**
     * Get all calendars for a user
     * 
     * @param userId User ID
     * @return List of calendars
     */
    @GetMapping("/calendars/{userId}")
    public ResponseEntity<List<Calendar>> getCalendarsByUserId(@PathVariable Long userId) {
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }

        List<Calendar> calendars = calendarService.findByUserId(userId);
        return ResponseEntity.ok(calendars);
    }

    /**
     * Create a new calendar
     * 
     * @param calendar Calendar information
     * @return Created calendar
     */
    @PostMapping("/calendars")
    public ResponseEntity<?> createCalendar(@RequestBody Map<String, Object> request) {
        Long userId = Long.valueOf(request.get("userId").toString());
        String name = (String) request.get("name");
        String filters = request.get("filters") != null ? request.get("filters").toString() : null;

        if (userId == null || name == null || name.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "User ID and calendar name are required"));
        }

        Calendar calendar = new Calendar();
        calendar.setUserId(userId);
        calendar.setName(name);
        calendar.setFilters(filters);

        Calendar createdCalendar = calendarService.createCalendar(calendar);
        return new ResponseEntity<>(createdCalendar, HttpStatus.CREATED);
    }

    /**
     * Update a calendar
     * 
     * @param id      Calendar ID
     * @param request Update information
     * @return Updated calendar
     */
    @PutMapping("/calendars/{id}")
    public ResponseEntity<?> updateCalendar(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        String name = (String) request.get("name");
        String filters = request.get("filters") != null ? request.get("filters").toString() : null;

        if (id == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid calendar ID"));
        }

        if (name == null || name.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Calendar name is required"));
        }

        Calendar calendar = calendarService.findById(id);
        if (calendar == null) {
            return ResponseEntity.notFound().build();
        }

        calendar.setName(name);
        calendar.setFilters(filters);

        Calendar updatedCalendar = calendarService.updateCalendar(calendar);
        return ResponseEntity.ok(updatedCalendar);
    }

    /**
     * Delete a calendar
     * 
     * @param id Calendar ID
     * @return Success message
     */
    @DeleteMapping("/calendars/{id}")
    public ResponseEntity<?> deleteCalendar(@PathVariable Long id) {
        if (id == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid calendar ID"));
        }

        Calendar calendar = calendarService.findById(id);
        if (calendar == null) {
            return ResponseEntity.notFound().build();
        }

        calendarService.deleteCalendar(id);
        return ResponseEntity.ok(Map.of("message", "Calendar deleted successfully"));
    }
}