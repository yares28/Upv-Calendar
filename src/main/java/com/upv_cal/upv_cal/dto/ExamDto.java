package com.upv_cal.upv_cal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for Exam
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamDto {
    private Long id;
    private String subject;
    private String date;
    private String time;
    private String location;
    private String degree;
    private Integer semester;
    private String notes;
}