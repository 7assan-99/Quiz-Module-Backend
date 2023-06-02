import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './question.entity';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { Category } from 'src/category/category.entity';

@Injectable()
export class QuestionService {

    constructor(@InjectRepository(Question)private qRepo: Repository<Question>){}

    async create(q: Question, id: number):Promise<InsertResult>{
        q.Created_By = id;
        q.Updated_By = id;
        return await this.qRepo.insert(q)
    }

    async get(id: string):Promise<Question>{
        return await this.qRepo.findOne({where:{ID: id}})
    }

    async update(q: Question,id: number):Promise<UpdateResult>{
        q.Updated_By = id
        return await this.qRepo.update(q.ID,q)
    }

    async delete(id: string):Promise<DeleteResult>{
        return await this.qRepo.delete(id)
    }

    async getQuestionsByExam(eId: string){
        let questions: Question[] = [];
        await this.qRepo.query(`Select q.ID,q.Question,q.Choices,q.Question_Type,q.Answer,q.Points,q.testFilePath,q.C_ID,q.functionName from question as q left join exam as e on e.QuestionBank = q.QB_ID where e.ID = '${eId}'`).then((val)=>{
            questions = val;
        })
        questions.map((val)=>{
            if(val.Answer){
                val.Answer = JSON.parse(val.Answer.toString());
            }
            if(val.Choices){
                val.Choices = JSON.parse(val.Choices.toString());
            }
            
            return val
        })
        return questions
    }

    async prepareExamQuestionForStudent(qbId: string){
        let questions: Question[]=[];

        let category: Category[]=[]
        await this.qRepo
          .query(
            `Select DISTINCT c.ID,c.no_questions_to_appear_in_exam from category as c left join question as q ON c.ID=q.C_ID left join question_bank as qb ON qb.ID = q.QB_ID where q.QB_ID = '${qbId}'`,
          ).then((val)=>{
            category = val
          })
        
        for(let i=0;i< category.length;i++){
            await this.qRepo.query(`select * from question as q where q.C_ID = ${category[i].ID} ORDER BY RAND() limit ${category[i].no_questions_to_appear_in_exam}`).then((val)=>{
                let q: any[] = val
                questions.push(...q)
            })
        }
        return questions
        
    }

    async getQuestionsByExamAttempt(eaId: string, sId: number){
        let questions: any;
        await this.qRepo
          .query(
            `Select DISTINCT q.ID,q.Question,q.Question_Type,q.Choices,e_r.Student_Answer,e_r.codeFilePath,q.Points,e_q.ExamAttempt_ID,q.functionName from exam_attempt as e_a left join exam_attempt_question as e_q ON e_q.ExamAttempt_ID = e_a.ID left join exam_response as e_r ON e_r.ExamAttempt_ID = e_q.ExamAttempt_ID and e_q.Question_ID = e_r.Question_ID left join question as q ON q.ID = e_q.Question_ID where e_a.ID = '${eaId}' and e_a.Student_ID = ${sId} and e_a.TimeToEnd > CURRENT_TIMESTAMP()`,
          )
          .then((val) => {
            questions = val;
          });
        questions.map((val) => {
          if (val.Answer) {
            val.Answer = JSON.parse(val.Answer.toString());
          }
          if (val.Choices) {
            val.Choices = JSON.parse(val.Choices.toString());
          }
          return val;
        });
        return questions
    }
}
