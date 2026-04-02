package com.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {
    private long totalStudents;
    private long presentToday;
    private long absentToday;
    private double overallAttendancePercentage;
    private List<TrendData> weeklyTrend;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TrendData {
        private String date;
        private long present;
        private long absent;
    }
}
