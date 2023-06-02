import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from './entities/exam.entity';
import { ExamService } from './exam.service';
import { ExamController } from './exam.controller';
import { AuthModule } from 'src/auth/auth.module';
import { InstructorModule } from 'src/instructor/instructor.module';
import { QuestionBank } from 'src/question-bank/entities/question-bank.entity';
import { QuestionBankService } from 'src/question-bank/question-bank.service';

@Module({
  imports: [AuthModule, InstructorModule, TypeOrmModule.forFeature([Exam]), TypeOrmModule.forFeature([QuestionBank])],
  providers: [ExamService, QuestionBankService],
  controllers: [ExamController],
  exports: [TypeOrmModule.forFeature([Exam]),ExamService],
})
export class ExamModule {}
