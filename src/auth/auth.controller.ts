import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  
  @Post('/login')
  async login(@Body() u: any) {
    return this.authService.validateUser(u.ID,u.Password);
  }
}
