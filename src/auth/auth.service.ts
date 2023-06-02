import { Injectable,UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from 'src/admin/admin.service';
import { InstructorService } from 'src/instructor/instructor.service';
import { StudentService } from 'src/student/student.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly uService: UserService,
        private jwtService: JwtService,
        private readonly sService: StudentService,
        private readonly iService: InstructorService,
        private readonly adService: AdminService,
        ){}

    async validateUser(id: number,password: string):Promise<any>{
        const user = await this.uService.getUser(id)
        if(!user) throw new UnauthorizedException('Wrong Credentials');

        if(password === user.Password)
            return this.login(id)
        throw new UnauthorizedException('Wrong Credentials')
    }

    async login(id: number){
        let payload = {} as {}
        let u:any = await this.sService.getStudent(id)
        //if there is no student match
        if(u.length == 0){
            u = await this.iService.getInstructor(id)
            //if there is no instructor match
            if(u.length == 0){
                u = await this.adService.getAdmin(id)
                //if there is no admin match
                if(u.length == 0){
                  throw new UnauthorizedException('Wrong Credentials');
                }
                let masterAdmin:any;
                masterAdmin = u[0].isMasterAdmin === 1 ? true : false
                payload = {
                  sub: id,
                  role: 'admin',
                  masteradmin: masterAdmin
                };
                return {
                  access_token: this.jwtService.sign(payload, {
                    secret: process.env.JWT_KEY,
                    expiresIn: '3h',
                  }),
                };
                
            }
            else{
                payload = { sub: id, role: 'instructor' };
                return {
                  access_token: this.jwtService.sign(payload, {
                    secret: process.env.JWT_KEY,
                    expiresIn: '3h'
                  }),
                };
            }  
        }
        payload = { sub: id, role: 'student' };
        return {
          access_token: this.jwtService.sign(payload, {
            secret: process.env.JWT_KEY,
            expiresIn: '3h',
          }),
        };
    }
}
