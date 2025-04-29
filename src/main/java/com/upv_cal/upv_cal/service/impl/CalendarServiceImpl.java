package com.upv_cal.upv_cal.service.impl;

import com.upv_cal.upv_cal.model.Calendar;
import com.upv_cal.upv_cal.repository.CalendarRepository;
import com.upv_cal.upv_cal.service.CalendarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Implementation of CalendarService interface
 */
@Service
public class CalendarServiceImpl implements CalendarService {

    @Autowired
    private CalendarRepository calendarRepository;

    @Override
    public Calendar findById(Long id) {
        return calendarRepository.findById(id).orElse(null);
    }

    @Override
    public List<Calendar> findByUserId(Long userId) {
        return calendarRepository.findByUserId(userId);
    }

    @Override
    public Calendar createCalendar(Calendar calendar) {
        return calendarRepository.save(calendar);
    }

    @Override
    public Calendar updateCalendar(Calendar calendar) {
        return calendarRepository.save(calendar);
    }

    @Override
    public void deleteCalendar(Long id) {
        calendarRepository.deleteById(id);
    }
}