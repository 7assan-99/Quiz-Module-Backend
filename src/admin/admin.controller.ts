import {
  Controller,
  UseGuards,
  Delete,
  Param,
  UnauthorizedException,
  Post,
  Get,
  Put,
  Body,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/Guard/auth.guard';
import { Role } from 'src/auth/Role/role.enum';
import { Roles } from 'src/auth/Role/roles.decorator';
import { RolesGuard } from 'src/auth/Role/roles.guard';
import { DeleteResult, InsertResult } from 'typeorm';
import { AdminService } from './admin.service';
import { GetUser } from 'src/auth/GetUser/getUser.decorator';
import { Admin } from './entities/admin.entity';

@Controller('admin')
export class AdminController {
  constructor(private readonly aService: AdminService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete('/delete/:id')
  deleteAdmin(
    @Param('id') id: number,
    @GetUser() u,
  ): Promise<DeleteResult | UnauthorizedException> {
    return this.aService.deleteAdmin(id, u);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('/:id')
  getAdmin(@Param('id') id: number): Promise<Admin> {
    return this.aService.getAdmin(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('')
  getAdmins(): Promise<Admin[]> {
    return this.aService.getAdmins();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Put('/update/:id')
  updateAdmin(@Body()u: any,@Param('id')id: number){
    return this.aService.updateAdmin(id,u)
  }
}
