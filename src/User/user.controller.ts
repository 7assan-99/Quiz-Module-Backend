import { Body, Controller, Get, Param, Post, UseGuards, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Student } from 'src/student/entities/student.entity';
import { UserService } from './user.service';
import { User } from './user.entity';
import { StudentService } from 'src/student/student.service';
import { Instructor } from 'src/instructor/entities/instructor.entity';
import { InstructorService } from 'src/instructor/instructor.service';
import { AuthGuard } from 'src/auth/Guard/auth.guard';
import { Roles } from 'src/auth/Role/roles.decorator';
import { Role } from 'src/auth/Role/role.enum';
import { RolesGuard } from 'src/auth/Role/roles.guard';
import { Admin } from 'src/admin/entities/admin.entity';
import { GetUser } from 'src/auth/GetUser/getUser.decorator';

@Controller('user')
export class UserController {
  constructor(
    private uService: UserService,
    private sService: StudentService,
    private iService: InstructorService,
  ) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Post('/create-student/:major')
  @Roles(Role.Admin)
  createStudent(
    @Body() u: User,
    @Param('major') major: string,
  ): Promise<Student> {
    return this.uService.createStudent(u, major);
  }

  @UseGuards(AuthGuard)
  @Get('/get-student/:id')
  getStudent(@Param('id') id: number): Promise<Student> {
    return this.sService.getStudent(id);
  }

  @UseGuards(AuthGuard)
  @Get('/get-students')
  getStudents(@Param('id') id: number): Promise<Student> {
    return this.sService.getStudent(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post('/create-Instructor/:speciality')
  createInstructor(
    @Body() ins: User,
    @Param('speciality') s: string,
  ): Promise<Instructor> {
    return this.uService.createInstructor(ins, s);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post('/create-admin/:isMaster')
  createAdmin(
    @Body() u: User,
    @Param('isMaster') isMaster: string,
    @GetUser() user: any,
  ): Promise<Admin | UnauthorizedException | BadRequestException> {
    if (isMaster.trim() === '') {
      new BadRequestException();
    } else {
      return this.uService.createAdmin(u, isMaster, user);
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Instructor)
  @Get('/get-Instructor/:id')
  getInstructor(@Param('id') id: number): Promise<Instructor> {
    return this.iService.getInstructor(id);
  }

}
