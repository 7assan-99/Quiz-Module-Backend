import { Controller,Post,UseGuards, Body, Get, Param, Put, Delete, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from 'src/auth/Guard/auth.guard';
import { Role } from 'src/auth/Role/role.enum';
import { Roles } from 'src/auth/Role/roles.decorator';
import { RolesGuard } from 'src/auth/Role/roles.guard';
import { Exam } from './entities/exam.entity';
import { ExamService } from './exam.service';
import { GetId } from 'src/auth/GetId/getId.decorator';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('exam')
export class ExamController {
  constructor(private readonly exService: ExamService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Instructor)
  @Post('/create/:qb')
  createExam(
    @Body() e: Exam,
    @GetId() id: number,
    @Param('qb') qb: string,
  ): Promise<any> {
    return this.exService.createExam(e, id, qb);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Instructor)
  @Get('/canCreateExam/:cId')
  canCreateExam(@Param('cId') cId: string): Promise<Boolean> {
    return this.exService.canCreateExam(cId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Instructor, Role.Admin)
  @Get('/getExamById/:id')
  getExam(@Param('id') id: string): Promise<Exam> {
    return this.exService.getExam(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Instructor, Role.Admin)
  @Put('/publishExam/:pub/:eId')
  publishExam(@Param('pub') pub: boolean, @Param('eId') id: string) {
    return this.exService.publishExam(id, pub);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Instructor)
  @Get('/getCurrentExamByCourse/:cId')
  getCurrentExamByCourse(@Param('cId') cId: string): Promise<Exam> {
    return this.exService.getCurrentExamByCourse(cId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Student)
  @Get('/getCurrentExamByCourseForStudent/:cId')
  getCurrentExamByCourseForStudent(@Param('cId') cId: string): Promise<Exam> {
    return this.exService.getCurrentExamByCourseForStudent(cId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Instructor)
  @Get('/getExamsByCourse/:cId')
  getExamsByCourse(@Param('cId') cId: string): Promise<Exam[]> {
    return this.exService.getExamsByCourse(cId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Instructor)
  @Put('/updateExam')
  updateExam(@Body() e: Exam): Promise<UpdateResult> {
    return this.exService.UpdateExam(e);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Instructor)
  @Delete('/deleteExam/:id')
  deleteExam(
    @Param('id') id: string,
    @GetId() uId: number,
  ): Promise<DeleteResult | UnauthorizedException> {
    return this.exService.DeleteExam(id, uId);
  }
}
