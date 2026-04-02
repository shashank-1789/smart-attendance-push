package com.attendance.service.impl;

import com.attendance.dto.AttendanceRequest;
import com.attendance.dto.AttendanceResponse;
import com.attendance.dto.DashboardStats;
import com.attendance.exception.ResourceNotFoundException;
import com.attendance.model.Attendance;
import com.attendance.model.Student;
import com.attendance.repository.AttendanceRepository;
import com.attendance.repository.StudentRepository;
import com.attendance.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;

    @Override
    @Transactional
    public void markAttendance(AttendanceRequest request, String markedBy) {
        for (AttendanceRequest.AttendanceRecord record : request.getRecords()) {
            Student student = studentRepository.findById(record.getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Student not found with id: " + record.getStudentId()));

            Attendance.Status status = Attendance.Status.valueOf(record.getStatus().toUpperCase());

            // Update if already exists for the same day, otherwise create new
            Optional<Attendance> existing = attendanceRepository
                    .findByStudentIdAndDate(record.getStudentId(), request.getDate());

            if (existing.isPresent()) {
                Attendance attendance = existing.get();
                attendance.setStatus(status);
                attendance.setMarkedBy(markedBy);
                attendanceRepository.save(attendance);
            } else {
                Attendance attendance = Attendance.builder()
                        .student(student)
                        .date(request.getDate())
                        .status(status)
                        .markedBy(markedBy)
                        .build();
                attendanceRepository.save(attendance);
            }
        }
    }

    @Override
    public List<AttendanceResponse> getAttendanceReport() {
        List<Student> students = studentRepository.findAll();
        return students.stream().map(student -> {
            long totalClasses = attendanceRepository.countTotalByStudentId(student.getId());
            long presentCount = attendanceRepository.countPresentByStudentId(student.getId());
            long absentCount = totalClasses - presentCount;
            double percentage = totalClasses > 0 ? (double) presentCount / totalClasses * 100 : 0;

            return AttendanceResponse.builder()
                    .studentId(student.getId())
                    .studentName(student.getName())
                    .rollNumber(student.getRollNumber())
                    .totalClasses(totalClasses)
                    .presentCount(presentCount)
                    .absentCount(absentCount)
                    .attendancePercentage(Math.round(percentage * 100.0) / 100.0)
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    public DashboardStats getDashboardStats() {
        LocalDate today = LocalDate.now();
        long totalStudents = studentRepository.count();
        long presentToday = attendanceRepository.countPresentByDate(today);
        long absentToday = attendanceRepository.countAbsentByDate(today);

        // Calculate overall attendance percentage
        long totalRecords = attendanceRepository.count();
        long totalPresent = studentRepository.findAll().stream()
                .mapToLong(s -> attendanceRepository.countPresentByStudentId(s.getId()))
                .sum();
        double overallPercentage = totalRecords > 0 ? (double) totalPresent / totalRecords * 100 : 0;

        // Get weekly trend (last 7 days)
        LocalDate weekAgo = today.minusDays(6);
        List<DashboardStats.TrendData> trend = new ArrayList<>();
        for (LocalDate date = weekAgo; !date.isAfter(today); date = date.plusDays(1)) {
            long present = attendanceRepository.countPresentByDate(date);
            long absent = attendanceRepository.countAbsentByDate(date);
            trend.add(DashboardStats.TrendData.builder()
                    .date(date.toString())
                    .present(present)
                    .absent(absent)
                    .build());
        }

        return DashboardStats.builder()
                .totalStudents(totalStudents)
                .presentToday(presentToday)
                .absentToday(absentToday)
                .overallAttendancePercentage(Math.round(overallPercentage * 100.0) / 100.0)
                .weeklyTrend(trend)
                .build();
    }
}
