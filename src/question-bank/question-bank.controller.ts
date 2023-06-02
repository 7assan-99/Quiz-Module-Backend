import { Controller, UseGuards, Post, Body, Get, Param, Delete, Put } from '@nestjs/common';
import { AuthGuard } from 'src/auth/Guard/auth.guard';
import { Role } from 'src/auth/Role/role.enum';
import { Roles } from 'src/auth/Role/roles.decorator';
import { RolesGuard } from 'src/auth/Role/roles.guard';
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import { QuestionBankService } from './question-bank.service';
import { QuestionBank } from './entities/question-bank.entity';

@Controller('question-bank')
export class QuestionBankController {
  constructor(private readonly qbService: QuestionBankService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Instructor)
  @Post('/create')
  createQB(@Body() qb: QuestionBank): Promise<InsertResult> {
    return this.qbService.createQuestionBank(qb);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Instructor)
  @Get('/:id')
  getQB(@Param('id') id: string): Promise<QuestionBank> {
    return this.qbService.getQuestionBank(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Instructor)
  @Delete('/:id')
  deleteQB(@Param('id')id: string): Promise<DeleteResult> {
    return this.qbService.deleteQuestionBank(id)
  }

  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.Instructor)
  @Put('/update')
  updateQB(@Body() qb:QuestionBank): Promise<UpdateResult>{
    return this.qbService.updateQuestionBank(qb)
  }
}
