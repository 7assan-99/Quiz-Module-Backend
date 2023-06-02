import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/Guard/auth.guard';
import { Role } from 'src/auth/Role/role.enum';
import { Roles } from 'src/auth/Role/roles.decorator';
import { RolesGuard } from 'src/auth/Role/roles.guard';
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import { Course } from './course.entity';
import { CourseService } from './course.service';
import { GetId } from 'src/auth/GetId/getId.decorator';

@Controller('course')
export class CourseController {
  constructor(private readonly cService: CourseService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post('/create')
  createCourse(@Body() c: Course, @GetId() uId: number): Promise<InsertResult> {
    return this.cService.createCourse(c, uId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Instructor)
  @Get('/getCoursesByInstructor')
  getCoursesByInstructor(@GetId() id: number): Promise<Course[]> {
    return this.cService.getCoursesByInstructor(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Student)
  @Get('/getCoursesByStudent')
  getCoursesByStudent(@GetId() id: number): Promise<Course[]> {
    return this.cService.getCoursesByStudent(id);
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  getCourse(@Param('id') id: string): Promise<Course> {
    return this.cService.getCourse(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get()
  getCourses(): Promise<Course[]> {
    return this.cService.getCourses();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post('/update/:id')
  updateCourse(
    @Body() c: Course,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return this.cService.updateCourse(c, id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete('/delete/:id')
  deleteCourse(
    @Param('id') id: string,
    @GetId() uId: number,
  ): Promise<DeleteResult> {
    return this.cService.deleteCourse(id, uId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('/searchCourseName/:q')
  searchCourseByName(@Param('q') q: string) {
    return this.cService.searchForCourse(q);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post('/addStudentsToCourse/:cId')
  addStudentsToCourse(@Body() students: any, @Param('cId') id: string) {
    return this.cService.addStudentsToCourse(students, id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post('/addInstructorsToCourse/:cId')
  addInstructorsToCourse(@Body() instructors: any, @Param('cId') id: string) {
    return this.cService.addInstructorsToCourse(instructors, id);
  }
}
