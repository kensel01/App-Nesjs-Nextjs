import { Cliente } from "../../clientes/entities/cliente.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TipoDeServicio {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 500})
    name: string;

    @OneToMany(()=>Cliente,(cliente)=>cliente.tipoDeServicio)
    clientes: Cliente[];
} 