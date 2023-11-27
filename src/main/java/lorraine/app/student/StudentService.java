package lorraine.app.student;

import lorraine.app.EmailValidator;
import lorraine.app.exception.ApiRequestException;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class StudentService {

    private final StudentDataAccessService studentDataAccessService;
    private final EmailValidator emailValidator;

    @Autowired
    public StudentService(StudentDataAccessService studentDataAccessService,
                          EmailValidator emailValidator) {
        this.studentDataAccessService = studentDataAccessService;
        this.emailValidator = emailValidator;
    }

    List<Student> getAllStudents() {
        return studentDataAccessService.selectAllStudents();
    }

    void addNewStudent(Student student) {
        addNewStudent(null, student);
    }

    void addNewStudent(UUID studentId, Student student) {
        UUID newStudentId = Optional.ofNullable(studentId)
                .orElse(UUID.randomUUID());

        //todo: validate email
        if (!emailValidator.test(student.getEmail())) {
            throw new ApiRequestException(student.getEmail() + " is not valid");
        }
        //todo: verify that email is not taken
        if(studentDataAccessService.isEmailTaken(student.getEmail())) {
            throw new ApiRequestException(student.getEmail() + " is taken");
        }

        studentDataAccessService.insertStudent(newStudentId, student);
    }

    List<StudentCourse> getAllCoursesForStudent(UUID studentId) {
        return studentDataAccessService.selectAllStudentsCourses(studentId);
    }

    public void updateStudent(UUID studentId, Student student) {
        Optional.ofNullable(student.getEmail())
                .ifPresent(email -> {
                    boolean taken = studentDataAccessService.selectExistsEmail(studentId, email);
                if (!taken) {
                    studentDataAccessService.updateEmail(studentId, email);
                } else {
                    throw new IllegalStateException("Email already in use: " + student.getEmail());
                }
            });

        Optional.ofNullable(student.getFirstName())
                .filter(firstName -> !StringUtils.isEmpty(firstName))
                .map(StringUtils::capitalize)
                .ifPresent(firstName -> studentDataAccessService.updateFirstName(studentId, firstName));

        Optional.ofNullable(student.getLastName())
                .filter(lastName -> !StringUtils.isEmpty(lastName))
                .map(StringUtils::capitalize)
                .ifPresent(lastName -> studentDataAccessService.updateLastName(studentId, lastName));
        }

        void deleteStudent(UUID studentId) {
            studentDataAccessService.deleteStudentById(studentId);
        }
    }
