package com.attendance.service;

import com.attendance.dto.AttendanceRequest;
import com.attendance.dto.AttendanceResponse;
import com.attendance.dto.DashboardStats;

import java.util.List;

public interface AttendanceService {
    void markAttendance(AttendanceRequest request, String markedBy);
    List<AttendanceResponse> getAttendanceReport();
    DashboardStats getDashboardStats();
}
