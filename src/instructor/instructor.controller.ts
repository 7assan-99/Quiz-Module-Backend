import { Controller, Get, UseGuards, Delete, Param, Put, Body, Post } from '@nestjs/common';
import { AuthGuard } from 'src/auth/Guard/auth.guard';
import { Role } from 'src/auth/Role/role.enum';
import { Roles } from 'src/auth/Role/roles.decorator';
import { RolesGuard } from 'src/auth/Role/roles.guard';
import { InstructorService } from './instructor.service';
import { Instructor } from './entities/instructor.entity';

@Controller('instructor')
export class InstructorController {
  constructor(private readonly iService: InstructorService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('')
  getInstrcutors(): Promise<Instructor[]> {
    return this.iService.getInstructors();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete('delete/:id')
  deleteInstructor(@Param('id') id: number): Promise<any> {
    return this.iService.deleteInstructor(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Instructor)
  @Post('publishGradesByExam/:eId/:pub')
  publishGradesByExam(@Param('eId') eId: string,@Param('pub') pub: boolean) {
    return this.iService.publishGradesByExam(eId,pub);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Instructor)
  @Get('getCourseExamsGradeListForInstructor/:cId')
  getCourseExamsGradeListForInstructor(@Param('cId') cId: string){
    return this.iService.getCourseExamsGradeListForInstructor(cId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Put('/update/:id')
  updateInstructor(@Param('id') id: number, @Body() u: any) {
    return this.iService.updateInstructor(id, u)
  }
}
