import { Injectable, UnauthorizedException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { Student } from 'src/student/entities/student.entity';
import { StudentService } from 'src/student/student.service';
import { Instructor } from 'src/instructor/entities/instructor.entity';
import { InstructorService } from 'src/instructor/instructor.service';
import { Admin } from 'src/admin/entities/admin.entity';
import { AdminService } from 'src/admin/admin.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private stdService: StudentService,
    private insService: InstructorService,
    private adService: AdminService
  ) {}
  
  async createStudent(u: User, major: string){
    let std: Student = {} as Student;
    let st;
    let usr = this.userRepo.create(u);
    await this.userRepo.insert(usr).then(async (val)=>{
      std = { ID: u.ID, Major: major };
      await this.stdService.createStudent(std).then((val)=>{
        st = val
      });
    })
      
    return st;
  }

  async createInstructor(u: User,s:string): Promise<Instructor> {
    let ins: Instructor = {} as Instructor;
    let i = {} as Instructor;
    await this.userRepo.save(u).then(async (u: User) => {
      ins = { ID: u.ID,Speciality: s };
      await this.insService.createInstructor(ins).then(()=>{
        i = ins
      });
    });
    return i;
  }

  async createAdmin(u:User,q: string,admin: any):Promise<Admin | UnauthorizedException>{
    if(admin.isMasterAdmin === false)
      return new UnauthorizedException()
    let ad = {} as Admin;
    let isMaster = q == 'true' ? true : false;
    await this.userRepo.insert(u).then(async () => {
      admin = { ID: u.ID, isMasterAdmin:  isMaster};
      await this.adService.createAdmin(admin).then(() => {
        ad = admin
      });
    });
    return ad
  }

  async getUser(ID: number):Promise<User>{
    return await this.userRepo.findOne({where:{ID: ID}})
  }
}
