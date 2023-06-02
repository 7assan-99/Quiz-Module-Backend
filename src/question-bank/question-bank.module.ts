import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionBank } from './entities/question-bank.entity';
import { QuestionBankService } from './question-bank.service';
import { QuestionBankController } from './question-bank.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionBank]), AuthModule],
  providers: [QuestionBankService],
  controllers: [QuestionBankController],
  exports: [TypeOrmModule.forFeature([QuestionBank]), QuestionBankService],
})
export class QuestionBankModule {}
