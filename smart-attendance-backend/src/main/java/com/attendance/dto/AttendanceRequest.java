package com.attendance.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class AttendanceRequest {

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotNull(message = "Records are required")
    private List<AttendanceRecord> records;

    @Data
    public static class AttendanceRecord {
        @NotNull(message = "Student ID is required")
        private Long studentId;

        @NotNull(message = "Status is required")
        private String status; // PRESENT or ABSENT
    }
}
