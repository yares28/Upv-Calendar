package com.upv_cal.upv_cal.mapper;

import com.upv_cal.upv_cal.dto.ExamDto;
import com.upv_cal.upv_cal.model.Exam;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper for converting between Exam entity and ExamDto
 */
@Component
public class ExamMapper {

    /**
     * Convert Exam entity to ExamDto
     * 
     * @param exam Exam entity
     * @return ExamDto
     */
    public ExamDto toDto(Exam exam) {
        if (exam == null) {
            return null;
        }

        return ExamDto.builder()
                .id(exam.getId())
                .subject(exam.getSubject())
                .date(exam.getDate())
                .time(exam.getTime())
                .location(exam.getLocation())
                .degree(exam.getDegree())
                .semester(exam.getSemester())
                .notes(exam.getNotes())
                .build();
    }

    /**
     * Convert list of Exam entities to list of ExamDtos
     * 
     * @param exams List of Exam entities
     * @return List of ExamDtos
     */
    public List<ExamDto> toDtoList(List<Exam> exams) {
        if (exams == null) {
            return List.of();
        }

        return exams.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Convert ExamDto to Exam entity
     * 
     * @param examDto ExamDto
     * @return Exam entity
     */
    public Exam toEntity(ExamDto examDto) {
        if (examDto == null) {
            return null;
        }

        Exam exam = new Exam();
        exam.setId(examDto.getId());
        exam.setSubject(examDto.getSubject());
        exam.setDate(examDto.getDate());
        exam.setTime(examDto.getTime());
        exam.setLocation(examDto.getLocation());
        exam.setDegree(examDto.getDegree());
        exam.setSemester(examDto.getSemester());
        exam.setNotes(examDto.getNotes());

        return exam;
    }
}