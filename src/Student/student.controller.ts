import { Controller,Post, UseGuards, Param, UnauthorizedException, BadRequestException, Get, Delete, Put, Body } from '@nestjs/common';
import { StudentService } from './student.service';
import { AuthGuard } from 'src/auth/Guard/auth.guard';
import { RolesGuard } from 'src/auth/Role/roles.guard';
import { Roles } from 'src/auth/Role/roles.decorator';
import { Role } from 'src/auth/Role/role.enum';
import { GetId } from 'src/auth/GetId/getId.decorator';
import { DeleteResult, InsertResult } from 'typeorm';
import { Exam_Attempt } from './entities/exam_attempt.entity';

@Controller('student')
export class StudentController {
  constructor(private readonly stService: StudentService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Student)
  @Post('createAttempt/:eid')
  createAttempt(
    @Param('eid') eid: string,
    @GetId() uId: number,
  ): Promise<InsertResult | UnauthorizedException | BadRequestException> {
    return this.stService.createExamAttempt(eid, uId);
  }


  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Student)
  @Post('addQuestionResponse/:eaid')
  addQuestionResponse(@Body() q: any, @Param('eaid') eaId) {
    return this.stService.addQuestionResponse(q, eaId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Student)
  @Get('getCourseExamGradeListByStudent/:cId')
  getCourseExamGradeListByStudent(@Param('cId') cId: string, @GetId() sId) {
    return this.stService.getCourseExamGradeListByStudent(cId, sId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Student)
  @Get('getExamAttemptById/:eaId')
  getExamAttemptByID(@Param('eaId') eaId: string, @GetId() sId: number) {
    return this.stService.getExamAttemptById(eaId, sId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Student)
  @Get('getOngoingAttempt/:eId')
  getOngoingExamAttempt(
    @Param('eId') eId: string,
    @GetId() sId,
  ): Promise<Exam_Attempt> {
    return this.stService.getOnGoingAttempt(eId, sId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('')
  getStudents(): Promise<any[]> {
    return this.stService.getStudents();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete('delete/:id')
  deleteStudent(@Param('id') id: number): Promise<any> {
    return this.stService.deleteStudent(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Student)
  @Put('submitExamAttempt/:eaId')
  submitExamAttempt(@Param('eaId') eaId: string, @GetId() sId: number) {
    return this.stService.submitExamAttempt(eaId, sId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Put('update/:id')
  updateStudent(@Param('id') id: number, @Body() u: any): Promise<any> {
    return this.stService.updateStudent(id, u);
  }

  @Post('gradeExamAttempt/:eaId')
  gradeExamAttempt(@Param('eaId') eaId) {
    this.stService.GradeExamAttempt(eaId);
  }
}
