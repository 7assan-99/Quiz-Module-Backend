import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';


@Injectable()
export class CategoryService {

    constructor(@InjectRepository(Category)private ctRepo: Repository<Category>){}

    async createCategory(c: Category, uId: number): Promise<InsertResult>{
        c.Created_By = uId
        c.Updated_By = uId
        return await this.ctRepo.insert(c)
    }

    async getCategoriesByExam(eId: string):Promise<Category[]>{
        return await this.ctRepo.query(
          `SELECT ct.ID, ct.Name, ct.no_questions_to_appear_in_exam from category as ct WHERE ct.Exam_ID = '${eId}'`,
        );
    }

    async getCategory(id: number):Promise<Category>{
        return await this.ctRepo.findOne({where:{ID: id}})
    }

    async updateCategory(c: Category,upt_id: number):Promise<UpdateResult>{
        c.Updated_By = upt_id;
        return await this.ctRepo.update(c.ID,c)
    }

    async deleteCategory(ctId: number,uId: number):Promise<DeleteResult | UnauthorizedException>{
        let ct = await this.getCategory(ctId)
        if(ct.Created_By == uId)
            return this.ctRepo.delete(ctId)
        throw new UnauthorizedException('Can\'t delete record since it\'s not created by you.')
    }
}
