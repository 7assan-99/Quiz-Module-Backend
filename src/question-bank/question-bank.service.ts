import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionBank } from './entities/question-bank.entity';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class QuestionBankService {

    constructor(@InjectRepository(QuestionBank)private qbRepo: Repository<QuestionBank>){}

    async createQuestionBank(qb: QuestionBank):Promise<InsertResult>{
        return await this.qbRepo.insert(qb)
    }

    async getQuestionBank(id: string):Promise<QuestionBank>{
        return await this.qbRepo.findOne({where:{ID: id}})
    }

    async deleteQuestionBank(id:string):Promise<DeleteResult>{
        return await this.qbRepo.delete(id)
    }

    async updateQuestionBank(qb: QuestionBank):Promise<UpdateResult>{
        return await this.qbRepo.update(qb.ID,qb)
    }
}
