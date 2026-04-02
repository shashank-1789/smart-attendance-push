package com.attendance.repository;

import com.attendance.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    Optional<Attendance> findByStudentIdAndDate(Long studentId, LocalDate date);

    List<Attendance> findByDate(LocalDate date);

    List<Attendance> findByStudentId(Long studentId);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.date = :date AND a.status = 'PRESENT'")
    long countPresentByDate(@Param("date") LocalDate date);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.date = :date AND a.status = 'ABSENT'")
    long countAbsentByDate(@Param("date") LocalDate date);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId AND a.status = 'PRESENT'")
    long countPresentByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId")
    long countTotalByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT DISTINCT a.date FROM Attendance a WHERE a.date BETWEEN :startDate AND :endDate ORDER BY a.date")
    List<LocalDate> findDistinctDatesBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.date = :date")
    long countByDate(@Param("date") LocalDate date);
}
