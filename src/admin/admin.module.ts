import { Module } from '@nestjs/common';
import { Admin } from './entities/admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Admin])],
  providers: [AdminService, JwtService],
  controllers: [AdminController],
  exports: [TypeOrmModule.forFeature([Admin]), AdminService],
})
export class AdminModule {}
