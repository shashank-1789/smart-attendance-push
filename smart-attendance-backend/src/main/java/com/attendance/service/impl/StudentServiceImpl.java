package com.attendance.service.impl;

import com.attendance.dto.StudentDTO;
import com.attendance.exception.BadRequestException;
import com.attendance.exception.ResourceNotFoundException;
import com.attendance.model.Student;
import com.attendance.repository.StudentRepository;
import com.attendance.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    @Override
    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public StudentDTO getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        return toDTO(student);
    }

    @Override
    @Transactional
    public StudentDTO createStudent(StudentDTO dto) {
        if (studentRepository.existsByRollNumber(dto.getRollNumber())) {
            throw new BadRequestException("Roll number already exists: " + dto.getRollNumber());
        }
        if (studentRepository.existsByEmail(dto.getEmail())) {
            throw new BadRequestException("Email already exists: " + dto.getEmail());
        }

        Student student = Student.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .rollNumber(dto.getRollNumber())
                .department(dto.getDepartment())
                .year(dto.getYear())
                .branch(dto.getBranch())
                .build();

        Student saved = studentRepository.save(student);
        return toDTO(saved);
    }

    @Override
    @Transactional
    public StudentDTO updateStudent(Long id, StudentDTO dto) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        student.setName(dto.getName());
        student.setEmail(dto.getEmail());
        student.setRollNumber(dto.getRollNumber());
        student.setDepartment(dto.getDepartment());
        student.setYear(dto.getYear());
        student.setBranch(dto.getBranch());

        Student updated = studentRepository.save(student);
        return toDTO(updated);
    }

    @Override
    @Transactional
    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Student not found with id: " + id);
        }
        studentRepository.deleteById(id);
    }

    @Override
    public List<StudentDTO> searchStudents(String query) {
        return studentRepository
                .findByNameContainingIgnoreCaseOrRollNumberContainingIgnoreCase(query, query)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<StudentDTO> filterStudents(Integer year, String branch) {
        List<Student> students;
        if (year != null && branch != null && !branch.isEmpty()) {
            students = studentRepository.findByYearAndBranch(year, branch);
        } else if (year != null) {
            students = studentRepository.findByYear(year);
        } else if (branch != null && !branch.isEmpty()) {
            students = studentRepository.findByBranch(branch);
        } else {
            students = studentRepository.findAll();
        }
        return students.stream().map(this::toDTO).collect(Collectors.toList());
    }

    private StudentDTO toDTO(Student student) {
        StudentDTO dto = new StudentDTO();
        dto.setId(student.getId());
        dto.setName(student.getName());
        dto.setEmail(student.getEmail());
        dto.setRollNumber(student.getRollNumber());
        dto.setDepartment(student.getDepartment());
        dto.setYear(student.getYear());
        dto.setBranch(student.getBranch());
        return dto;
    }
}
