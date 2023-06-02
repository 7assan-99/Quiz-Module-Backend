import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports:[
        AuthModule,
        TypeOrmModule.forFeature([Category])],
    providers: [CategoryService],
    controllers: [CategoryController],
    exports:[TypeOrmModule.forFeature([Category]),CategoryService]
})
export class CategoryModule {
}
