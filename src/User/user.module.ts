import { Module } from '@nestjs/common';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { StudentService } from 'src/student/student.service';
import { Student } from 'src/student/entities/student.entity';
import { Instructor } from 'src/instructor/entities/instructor.entity';
import { InstructorService } from 'src/instructor/instructor.service';
import { PassportModule } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { AdminModule } from 'src/admin/admin.module';
import { InstructorModule } from 'src/instructor/instructor.module';
import { StudentModule } from 'src/student/student.module';
import { AuthModule } from 'src/auth/auth.module';
import { AdminService } from 'src/admin/admin.service';
import { AuthService } from 'src/auth/auth.service';
import { Admin } from 'src/admin/entities/admin.entity';
import { CourseService } from 'src/course/course.service';
import { Course } from 'src/course/course.entity';
import { Exam_Attempt } from 'src/student/entities/exam_attempt.entity';
import { ExamService } from 'src/exam/exam.service';
import { Exam } from 'src/exam/entities/exam.entity';
import { QuestionBankModule } from 'src/question-bank/question-bank.module';
import { QuestionBankService } from 'src/question-bank/question-bank.service';
import { QuestionBank } from 'src/question-bank/entities/question-bank.entity';
import { ExamAttempt_Question } from 'src/exam/entities/exam-attempt-questions.entity';
import { Exam_Response } from 'src/student/entities/exam_response.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Student]),
    TypeOrmModule.forFeature([Instructor]),
    TypeOrmModule.forFeature([Admin]),
    TypeOrmModule.forFeature([Course]),
    TypeOrmModule.forFeature([Exam_Attempt]),
    TypeOrmModule.forFeature([Exam]),
    TypeOrmModule.forFeature([QuestionBank]),
    TypeOrmModule.forFeature([ExamAttempt_Question]),
    TypeOrmModule.forFeature([Exam_Response]),
  ],
  providers: [
    UserService,
    JwtService,
    StudentService,
    InstructorService,
    AdminService,
    CourseService,
    ExamService,
    QuestionBankService,
  ],
  controllers: [UserController],
  exports: [TypeOrmModule.forFeature([User]), UserService],
})
export class UserModule {}
