import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { Student_Course } from 'src/student/entities/student_course.entity';
import { Instructor_Course } from 'src/instructor/entities/instructor_course.entity';

@Injectable()
export class CourseService {
  constructor(@InjectRepository(Course) private cRep: Repository<Course>) {}

  async createCourse(c: Course, uId: number): Promise<InsertResult> {
    c.Created_By = uId;
    return await this.cRep.insert(c);
  }

  async getCourse(id: string): Promise<Course> {
    return await this.cRep.findOne({ where: { ID: id } });
  }

  async getCourses(): Promise<Course[]> {
    return await this.cRep.find();
  }

  async updateCourse(c: Course, id: string): Promise<UpdateResult> {
    return await this.cRep.update(id, c);
  }

  async deleteCourse(id: string, uId: number): Promise<DeleteResult> {
    let c = await this.cRep.findOne({ where: { ID: id } });
    if (c.Created_By == uId) {
      return await this.cRep.delete(id);
    }
    return null;
  }

  async searchForCourse(q: string) {
    return await this.cRep.query(
      `SELECT * from course where name like '%${q}%'`,
    );
  }

  async addStudentsToCourse(s: any[], courseId: string) {
    let data = [];
    console.log(s);
    s.forEach((st) => {
      data.push({ S_ID: st, C_ID: courseId });
    });
    return await this.cRep
      .createQueryBuilder()
      .insert()
      .into(Student_Course)
      .values(data)
      .execute();
  }

  async getCoursesByInstructor(id: number): Promise<Course[]> {
    return await this.cRep.query(
      `Select * from course as c left join instructor_course as i_c ON c.ID = i_c.C_ID where i_c.I_ID = ${id}`,
    );
  }

  async getCoursesByStudent(id: number): Promise<Course[]> {
    return await this.cRep.query(
      `Select * from course as c left join student_course as s_c ON c.ID = s_c.C_ID where s_c.S_ID = ${id}`,
    );
  }

  async addInstructorsToCourse(i: any[], courseId: string) {
    let data = [];
    i.forEach((it) => {
      data.push({ I_ID: it, C_ID: courseId });
    });
    return await this.cRep
      .createQueryBuilder()
      .insert()
      .into(Instructor_Course)
      .values(data)
      .execute();
  }
}
