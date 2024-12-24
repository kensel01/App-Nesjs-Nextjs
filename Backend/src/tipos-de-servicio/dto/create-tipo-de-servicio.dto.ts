import { IsString, MinLength } from "class-validator";

export class CreateTipoDeServicioDto {
    @IsString()
    @MinLength(3)
    name: string;
} 