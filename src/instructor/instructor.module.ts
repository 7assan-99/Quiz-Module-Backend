import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instructor } from './entities/instructor.entity';
import { Instructor_Course } from './entities/instructor_course.entity';
import { InstructorService } from './instructor.service';
import { InstructorController } from './instructor.controller';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { Student } from 'src/student/entities/student.entity';
import { Student_Course } from 'src/student/entities/student_course.entity';
import { Exam_Attempt } from 'src/student/entities/exam_attempt.entity';
import { Exam_Response } from 'src/student/entities/exam_response.entity';
import { Exam } from 'src/exam/entities/exam.entity';
import { CourseModule } from 'src/course/course.module';
import { UserService } from 'src/user/user.service';
import { StudentService } from 'src/student/student.service';
import { AdminService } from 'src/admin/admin.service';
import { User } from 'src/user/user.entity';
import { ExamService } from 'src/exam/exam.service';
import { Admin } from 'src/admin/entities/admin.entity';
import { QuestionBankService } from 'src/question-bank/question-bank.service';
import { QuestionBank } from 'src/question-bank/entities/question-bank.entity';
import { ExamAttempt_Question } from 'src/exam/entities/exam-attempt-questions.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Instructor]),
    TypeOrmModule.forFeature([Instructor_Course]),
    TypeOrmModule.forFeature([Student]),
    TypeOrmModule.forFeature([Student_Course]),
    TypeOrmModule.forFeature([Exam_Attempt]),
    TypeOrmModule.forFeature([Exam_Response]),
    TypeOrmModule.forFeature([Exam]),
    TypeOrmModule.forFeature([Instructor]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Admin]),
    TypeOrmModule.forFeature([QuestionBank]),
    TypeOrmModule.forFeature([ExamAttempt_Question]),
    AuthModule,
  ],
  providers: [
    InstructorService,
    AuthService,
    UserService,
    StudentService,
    AdminService,
    ExamService,
    QuestionBankService
  ],
  exports: [
    TypeOrmModule.forFeature([Instructor]),
    TypeOrmModule.forFeature([Instructor_Course]),
    InstructorService,
  ],
  controllers: [InstructorController],
})
export class InstructorModule {}
