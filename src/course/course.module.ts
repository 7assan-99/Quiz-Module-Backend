import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { AuthService } from 'src/auth/auth.service';
import { UserModule } from 'src/user/user.module';
import { StudentService } from 'src/student/student.service';
import { InstructorService } from 'src/instructor/instructor.service';
import { AdminService } from 'src/admin/admin.service';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Course]),UserModule],
  providers: [
    CourseService,
    JwtService,
  ],
  controllers: [CourseController],
  exports: [TypeOrmModule.forFeature([Course]), CourseService],
})
export class CourseModule {}
