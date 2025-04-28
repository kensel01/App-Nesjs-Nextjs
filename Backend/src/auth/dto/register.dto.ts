import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';
import { Role } from '../../common/enums/rol.enum';

export class RegisterDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsEmail()
  email: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(Role)
  role: Role;
}
