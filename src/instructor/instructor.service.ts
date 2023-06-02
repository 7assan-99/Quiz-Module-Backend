import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Instructor } from './entities/instructor.entity';
import { Repository } from 'typeorm';
import { distinct } from 'rxjs';

@Injectable()
export class InstructorService {
  constructor(
    @InjectRepository(Instructor) private insRepo: Repository<Instructor>,
  ) {}

  async createInstructor(ins: Instructor): Promise<Instructor> {
    let i = {} as Instructor;
    await this.insRepo.insert(ins).then(() => {
      i = ins;
    });
    return i;
  }

  async getInstructor(ID: number): Promise<Instructor> {
    return await this.insRepo.query(
      `SELECT u.ID,u.Name,u.Email,i.Speciality from user as u left join instructor as i ON u.ID = i.ID where i.ID = ${ID}`,
    );
  }

  async getInstructors(): Promise<Instructor[]> {
    return await this.insRepo.query(
      `SELECT u.ID,u.Name,u.Email,i.Speciality from user as u left join instructor as i ON u.ID = i.ID where i.ID = u.ID`,
    );
  }

  async updateInstructor(id: number, i: any) {
    return await this.insRepo.query(
      `UPDATE user LEFT JOIN instructor as i ON user.ID = i.ID SET user.Name='${i.Name}', i.Speciality='${i.Speciality}' WHERE user.ID = ${id}`,
    );
  }

  async deleteInstructor(id: number): Promise<any> {
    return await this.insRepo.delete(id).then(() => {
      this.insRepo.query(`DELETE from user where ID = ${id}`);
    });
  }

  async publishGradesByExam(eId: string,pub: boolean) {
    return this.insRepo.query(
      `Update exam_attempt as e_a Set isPublished= ${pub} where e_a.Exam_ID = '${eId}'`,
    );
  }

  async getCourseExamsGradeListForInstructor(cId: string) {
    let results = [];
    await this.insRepo.query(
      `Select e_a.Student_ID,e.ID as ExamId,e_a.Student_ID,e_a.ID,e.Title,e_a.Score,e_a.StartTime,e_a.FinishTime,e_a.isPublished from exam as e left join exam_attempt as e_a ON e_a.Exam_ID = e.ID and e_a.Score = (Select MAX(ea.Score) from exam_attempt as ea where ea.Student_ID = e_a.Student_ID and ea.Exam_ID = e_a.Exam_ID ORDER BY ea.Score ASC) where e.Course_ID = '${cId}' and e_a.Student_ID is not null ORDER BY e.ID`,
    ).then((val: any[])=>{
        let distinct: any=[];
        for (let i = 0; i < val.length; i++){
          if (!distinct.includes(val[i].ExamId))
            distinct.push(val[i].ExamId)
        }
        distinct.map((vl,i)=>{
          results[i] = val.filter((v) => v.ExamId === vl)
        })
  })
  return results;
  }
}
