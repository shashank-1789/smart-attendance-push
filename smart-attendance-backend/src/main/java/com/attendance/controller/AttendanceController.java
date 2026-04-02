package com.attendance.controller;

import com.attendance.dto.AttendanceRequest;
import com.attendance.dto.AttendanceResponse;
import com.attendance.dto.DashboardStats;
import com.attendance.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/mark")
    public ResponseEntity<Map<String, String>> markAttendance(
            @Valid @RequestBody AttendanceRequest request,
            Authentication authentication) {
        String markedBy = authentication.getName();
        attendanceService.markAttendance(request, markedBy);
        return ResponseEntity.ok(Map.of("message", "Attendance marked successfully"));
    }

    @GetMapping("/report")
    public ResponseEntity<List<AttendanceResponse>> getAttendanceReport() {
        return ResponseEntity.ok(attendanceService.getAttendanceReport());
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        return ResponseEntity.ok(attendanceService.getDashboardStats());
    }
}
