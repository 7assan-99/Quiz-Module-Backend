import { Module } from '@nestjs/common';
import { Student } from './entities/student.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student_Course } from './entities/student_course.entity';
import { Exam_Attempt } from './entities/exam_attempt.entity';
import { Exam_Response } from './entities/exam_response.entity';
import { StudentService } from './student.service';
import { CourseModule } from 'src/course/course.module';
import { CourseService } from 'src/course/course.service';
import { Course } from 'src/course/course.entity';
import { Exam } from 'src/exam/entities/exam.entity';
import { ExamService } from 'src/exam/exam.service';
import { InstructorModule } from 'src/instructor/instructor.module';
import { Instructor } from 'src/instructor/entities/instructor.entity';
import { InstructorService } from 'src/instructor/instructor.service';
import { StudentController } from './student.controller';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { QuestionBank } from 'src/question-bank/entities/question-bank.entity';
import { QuestionBankService } from 'src/question-bank/question-bank.service';
import { ExamAttempt_Question } from 'src/exam/entities/exam-attempt-questions.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Student]),
    TypeOrmModule.forFeature([Student_Course]),
    TypeOrmModule.forFeature([Exam_Attempt]),
    TypeOrmModule.forFeature([Exam_Response]),
    TypeOrmModule.forFeature([Exam]),
    TypeOrmModule.forFeature([Instructor]),
    TypeOrmModule.forFeature([QuestionBank]),
    TypeOrmModule.forFeature([ExamAttempt_Question]),
    CourseModule,
    AuthModule,
  ],
  providers: [StudentService, CourseService, ExamService, InstructorService,QuestionBankService],
  exports: [
    TypeOrmModule.forFeature([Student]),
    TypeOrmModule.forFeature([Student_Course]),
    TypeOrmModule.forFeature([Exam_Attempt]),
    TypeOrmModule.forFeature([Exam_Response]),
    StudentService,
  ],
  controllers: [StudentController],
})
export class StudentModule {}
