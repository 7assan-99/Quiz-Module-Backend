import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt/dist';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.auth';
import {JwtModule} from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport';
import { AdminModule } from 'src/admin/admin.module';
import { StudentModule } from 'src/student/student.module';
import { InstructorModule } from 'src/instructor/instructor.module';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { StudentService } from 'src/student/student.service';
import { Student } from 'src/student/entities/student.entity';
import { CourseService } from 'src/course/course.service';
import { ExamService } from 'src/exam/exam.service';
import { InstructorService } from 'src/instructor/instructor.service';
import { QuestionBankService } from 'src/question-bank/question-bank.service';

@Module({
  imports: [
    PassportModule,
    AdminModule,
    UserModule,
    AdminModule,
    JwtModule.register({
      secretOrPrivateKey: process.env.JWT_KEY
    }),
  ],
  providers: [
    AuthService,
    JwtService,
    LocalStrategy,
    UserService,
    InstructorService,
    StudentService,
    CourseService,
    ExamService,
    QuestionBankService
  ],
  controllers: [AuthController],
  exports:[JwtService]
})
export class AuthModule {}
