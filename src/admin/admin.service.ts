import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { DeleteResult, InsertResult, Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(@InjectRepository(Admin) private adminRepo: Repository<Admin>) {}

  async createAdmin(admin: Admin): Promise<InsertResult> {
    return await this.adminRepo.insert(admin);
  }

  async getAdmin(id: number): Promise<Admin> {
    return await this.adminRepo.query(
      `SELECT u.ID,u.Name,u.Email,a.isMasterAdmin from user as u left join admin as a ON u.ID = a.ID where u.ID = ${id}`,
    );
  }

  async getAdmins(): Promise<Admin[]> {
    return await this.adminRepo.query(
      `SELECT u.ID,u.Name,u.Email,a.isMasterAdmin from user as u left join admin as a ON u.ID = a.ID where u.ID = a.ID`,
    );
  }

  async deleteAdmin(
    id: number,
    user: any,
  ): Promise<DeleteResult | UnauthorizedException | any> {
    if (user.masteradmin == true) {
      return await this.adminRepo.delete(id).then(() => {
        this.adminRepo.query(`Delete from user where ID = ${id}`);
      });
    }
    return new UnauthorizedException();
  }

  async updateAdmin(id: number, a: any) {
    return await this.adminRepo.query(
      `UPDATE user LEFT JOIN admin as a ON user.ID = a.ID SET user.Name='${a.Name}', a.isMasterAdmin=${a.isMasterAdmin} WHERE user.ID = ${id}`,
    );
  }
}
