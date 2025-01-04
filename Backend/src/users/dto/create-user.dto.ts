import { Role } from "../../common/enums/rol.enum";
import { IsEmail, IsString, IsEnum, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(50)
    password: string;

    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name: string;

    @IsEnum(Role)
    role: Role;
}
