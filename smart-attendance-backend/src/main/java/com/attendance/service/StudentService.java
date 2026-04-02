package com.attendance.service;

import com.attendance.dto.StudentDTO;
import java.util.List;

public interface StudentService {
    List<StudentDTO> getAllStudents();
    StudentDTO getStudentById(Long id);
    StudentDTO createStudent(StudentDTO studentDTO);
    StudentDTO updateStudent(Long id, StudentDTO studentDTO);
    void deleteStudent(Long id);
    List<StudentDTO> searchStudents(String query);
    List<StudentDTO> filterStudents(Integer year, String branch);
}
