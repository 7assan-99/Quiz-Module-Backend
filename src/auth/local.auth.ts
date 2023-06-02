import { Injectable } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import {PassportStrategy} from '@nestjs/passport';
import { AuthService } from "./auth.service";
import { UnauthorizedException } from "@nestjs/common/exceptions";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy,'local'){

    constructor(private authService:AuthService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: process.env.JWT_KEY,
        });
    }

    async validate(ID: number,password: string):Promise<any>{
        const user = await this.authService.validateUser(ID,password)

        if(!user){
            throw new UnauthorizedException()
        }

        return user

        
    }

}