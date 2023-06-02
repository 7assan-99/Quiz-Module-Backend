import { Body, Controller, Delete, Get, Param, Post, Put, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/Guard/auth.guard';
import { Role } from 'src/auth/Role/role.enum';
import { Roles } from 'src/auth/Role/roles.decorator';
import { RolesGuard } from 'src/auth/Role/roles.guard';
import { CategoryService } from './category.service';
import { Category } from './category.entity';
import { GetId } from 'src/auth/GetId/getId.decorator';
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';

@Controller('category')
export class CategoryController {

    constructor(private readonly ctService: CategoryService){}

    @UseGuards(AuthGuard,RolesGuard)
    @Roles(Role.Instructor)
    @Post('/create')
    createCategory(@Body() ct: Category, @GetId() id:number): Promise<InsertResult>{
        return this.ctService.createCategory(ct, id)
    }

    @UseGuards(AuthGuard,RolesGuard)
    @Roles(Role.Instructor)
    @Get('/get-categories-by-exam/:id')
    getCategoriesByExam(@Param('id')eId: string):Promise<Category[]>{
        return this.ctService.getCategoriesByExam(eId)
    }

    @UseGuards(AuthGuard,RolesGuard)
    @Roles(Role.Instructor)
    @Put('/update-category')
    updateCategory(@Body() c: Category,@GetId()id: number):Promise<UpdateResult>{
        return this.ctService.updateCategory(c,id)
    }

    @UseGuards(AuthGuard,RolesGuard)
    @Roles(Role.Instructor)
    @Delete('/delete/:id')
    deleteCategory(@Param('id') id: number,@GetId() uId: number):Promise<DeleteResult | UnauthorizedException>{
        return this.ctService.deleteCategory(id,uId)
    }
}
