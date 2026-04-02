package com.attendance.config;

import com.attendance.model.Attendance;
import com.attendance.model.Student;
import com.attendance.model.User;
import com.attendance.repository.AttendanceRepository;
import com.attendance.repository.StudentRepository;
import com.attendance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final StudentRepository studentRepository;
    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (studentRepository.count() > 0) {
            return; // Already seeded
        }

        log.info("Seeding initial data...");

        // Create a default teacher account
        User teacher = User.builder()
                .fullName("Admin Teacher")
                .email("admin@school.com")
                .password(passwordEncoder.encode("admin123"))
                .role(User.Role.TEACHER)
                .build();
        userRepository.save(teacher);

        // Define branches and departments
        String[][] branchDeptPairs = {
                {"CSE", "Computer Science & Engineering"},
                {"ECE", "Electronics & Communication"},
                {"ME", "Mechanical Engineering"},
                {"CE", "Civil Engineering"},
                {"EE", "Electrical Engineering"},
                {"IT", "Information Technology"}
        };

        // Student names pool
        String[] firstNames = {
                "Aarav", "Priya", "Rahul", "Sneha", "Arjun", "Neha", "Vikram", "Ananya",
                "Karan", "Divya", "Rohan", "Meera", "Aditya", "Pooja", "Siddharth", "Kavya",
                "Harsh", "Riya", "Dhruv", "Ishita", "Manish", "Tanvi", "Rajesh", "Sakshi",
                "Nikhil", "Anjali", "Varun", "Shreya", "Pranav", "Nisha", "Akash", "Megha",
                "Gaurav", "Simran", "Tushar", "Bhavna", "Vivek", "Ritika", "Deepak", "Swati"
        };

        String[] lastNames = {
                "Sharma", "Patel", "Kumar", "Gupta", "Singh", "Verma", "Joshi", "Mishra",
                "Malhotra", "Reddy", "Agarwal", "Mehta", "Chauhan", "Nair", "Tiwari", "Yadav",
                "Iyer", "Kapoor", "Bansal", "Thakur"
        };

        Random random = new Random(42); // Fixed seed for reproducibility
        int studentIndex = 0;

        // Create students across 4 years and 6 branches
        for (int year = 1; year <= 4; year++) {
            for (String[] branchDept : branchDeptPairs) {
                String branch = branchDept[0];
                String department = branchDept[1];

                // 4-6 students per year per branch
                int numStudents = 4 + random.nextInt(3);
                for (int s = 0; s < numStudents; s++) {
                    studentIndex++;
                    String firstName = firstNames[studentIndex % firstNames.length];
                    String lastName = lastNames[studentIndex % lastNames.length];
                    String rollNumber = String.format("%s%d%03d", branch, year, s + 1);

                    Student student = Student.builder()
                            .name(firstName + " " + lastName)
                            .email(firstName.toLowerCase() + "." + lastName.toLowerCase() + studentIndex + "@school.com")
                            .rollNumber(rollNumber)
                            .department(department)
                            .year(year)
                            .branch(branch)
                            .build();

                    studentRepository.save(student);
                }
            }
        }

        log.info("Seeded {} students", studentRepository.count());

        // Seed attendance data for the last 10 days
        List<Student> allStudents = studentRepository.findAll();
        LocalDate today = LocalDate.now();

        for (int dayOffset = 9; dayOffset >= 0; dayOffset--) {
            LocalDate date = today.minusDays(dayOffset);
            // Skip weekends
            if (date.getDayOfWeek().getValue() >= 6) continue;

            for (Student student : allStudents) {
                // ~85% attendance rate
                Attendance.Status status = random.nextInt(100) < 85
                        ? Attendance.Status.PRESENT
                        : Attendance.Status.ABSENT;

                Attendance attendance = Attendance.builder()
                        .student(student)
                        .date(date)
                        .status(status)
                        .markedBy("admin@school.com")
                        .build();

                attendanceRepository.save(attendance);
            }
        }

        log.info("Seeded attendance data for {} days", 10);
        log.info("Default teacher login: admin@school.com / admin123");
    }
}
