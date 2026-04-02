package com.attendance.repository;

import com.attendance.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByRollNumber(String rollNumber);
    Optional<Student> findByEmail(String email);
    List<Student> findByNameContainingIgnoreCaseOrRollNumberContainingIgnoreCase(String name, String rollNumber);
    boolean existsByRollNumber(String rollNumber);
    boolean existsByEmail(String email);

    List<Student> findByYear(Integer year);
    List<Student> findByBranch(String branch);
    List<Student> findByYearAndBranch(Integer year, String branch);
}
