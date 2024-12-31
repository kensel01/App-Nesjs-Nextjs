import { Role } from "../../common/enums/rol.enum";

export class CreateUserDto {

    email: string;

    password: string;

    name?:string;

    role: Role;
}
