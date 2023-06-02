import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentModule } from './student/student.module';
import { UserModule } from './user/user.module';
import { join } from 'path';
import { ExamModule } from './exam/exam.module';
import { QuestionBankModule } from './question-bank/question-bank.module';
import { AdminModule } from './admin/admin.module';
import { InstructorModule } from './instructor/instructor.module';
import { CourseModule } from './course/course.module';
import { CategoryModule } from './category/category.module';
import { QuestionModule } from './question/question.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { MulterModule } from '@nestjs/platform-express';


@Module({
  imports: [
    MulterModule.register({
      dest:'./uploadedfiles',
      storage: './uploadedfiles'
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'exammanagement',
      synchronize: false,
      autoLoadEntities: true,
      entities: [join(__dirname,'/../**/**.entity{.ts,.js}')],
    }),
    ScheduleModule.forRoot(),
    UserModule,
    StudentModule,
    ExamModule,
    QuestionBankModule,
    AdminModule,
    InstructorModule,
    CourseModule,
    CategoryModule,
    QuestionModule,
    AuthModule,
    ConfigModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService,JwtService],
  exports:[]
})
export class AppModule {}
