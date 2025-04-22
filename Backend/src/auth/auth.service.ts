import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcryptjs from 'bcryptjs'
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService:UsersService,
        private readonly jwtService:JwtService
    ){}

    async register({name, email, password, role}:RegisterDto){

       const user = await this.usersService.findOneEmail(email);

       if(user){
        throw new BadRequestException('User already exists')
       }

        await this.usersService.create({
        name, 
        email, 
        password: await bcryptjs.hash(password, 10),
        role,
        isActive: true
    });
    return {
        name,
        email,
        role
    }
    }

    async login({email, password}:LoginDto){
        const user = await this.usersService.findEmailWithPassword(email);
        if(!user){
            throw new UnauthorizedException('Email o contraseña incorrectos');
        }

        if (!user.isActive) {
            throw new UnauthorizedException('Tu cuenta ha sido desactivada. Contacta al administrador.');
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if(!isPasswordValid){
            throw new UnauthorizedException('Email o contraseña incorrectos');
        }

        const payload = {email: user.email, role: user.role};
        const token = await this.jwtService.signAsync(payload);

        return {
            token,
            email,
            role: user.role,
            name: user.name
        };
    }
    
    async profile({email, role}:{email:string, role:string}){
        const user = await this.usersService.findOneEmail(email);
        
        if (!user.isActive) {
            throw new UnauthorizedException('Tu cuenta ha sido desactivada. Contacta al administrador.');
        }
        
        return user;
    }
}
