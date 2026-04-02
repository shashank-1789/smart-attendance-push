package com.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceResponse {
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private long totalClasses;
    private long presentCount;
    private long absentCount;
    private double attendancePercentage;
}
