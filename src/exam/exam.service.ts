import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Exam } from './entities/exam.entity';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { InstructorService } from 'src/instructor/instructor.service';
import { QuestionBankService } from 'src/question-bank/question-bank.service';
import * as moment from 'moment';
@Injectable()
export class ExamService {

    constructor(@InjectRepository(Exam)private exRepo: Repository<Exam>,private qbService: QuestionBankService){}

    async createExam(e: Exam,id: number,qbName: string):Promise<any>{
        let canCreate = await this.canCreateExam(e.Course_ID)
        console.log(canCreate)
        if(!canCreate) throw new UnauthorizedException('There is already an exam created and still not finished.')
        let qbId;
        this.qbService.createQuestionBank({Title: qbName}).then(async (val)=>{
            qbId = val.identifiers[0].ID
            e.QuestionBank = qbId
            e.Created_By = id
            return await this.exRepo.insert(e)
        })
        
    }

    async publishExam(eId: string,val: boolean){
        return await this.exRepo.query(`Update exam set isPublished = ${val} where ID = '${eId}'`)
    }

    async getCurrentExamByCourse(cId: string):Promise<Exam>{
        return await this.exRepo.query(
          `SELECT * from exam where Course_ID = '${cId}' and TimeToEnd > CURRENT_TIMESTAMP HAVING MAX(TimeToEnd);`,
        );
    }

    async getCurrentExamByCourseForStudent(cId: string):Promise<Exam>{
        return await this.exRepo.query(
          `SELECT * from exam where Course_ID = '${cId}' and isPublished=true and TimeToEnd > CURRENT_TIMESTAMP HAVING MAX(TimeToEnd)`,
        );
    }

    async canCreateExam(cId: string){
        let canCreate: boolean = true
        await this.exRepo.query(`Select * from exam where Course_ID = '${cId}' and TimeToEnd > CURRENT_TIMESTAMP`).then((val)=>{
            if(val.length >= 1){
                canCreate = false;
            }
        })
        return canCreate;
    }
    
    async getExam(id: string):Promise<Exam>{
        return await this.exRepo.findOne({where:{ID: id}})
    }

    async getExamsByCourse(cId: string):Promise<Exam[]>{
        return await this.exRepo.find({where: {Course_ID: cId}})
    }
    
    async UpdateExam(e:Exam):Promise<UpdateResult>{
        return await this.exRepo.update(e.ID, e);
    }

    async DeleteExam(id: string,uId: number):Promise<DeleteResult | UnauthorizedException>{
        const u = await this.exRepo.findOne({where: {ID: id}})
        if(u.Created_By == uId){
            return await this.exRepo.delete(id);
        }
        return new UnauthorizedException()
    }
}
