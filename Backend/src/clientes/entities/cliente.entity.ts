import { TipoDeServicio } from "src/tipos-de-servicio/entities/tipo-de-servicio.entity";
import { User } from "../../users/entities/user.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cliente {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    age: number;

    @DeleteDateColumn()
    deletedAt: Date;

    @ManyToOne(()=>TipoDeServicio, (tipoDeServicio)=>tipoDeServicio.id, {
        eager: true,
    })
    tipoDeServicio: TipoDeServicio;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userEmail', referencedColumnName: 'email',  })
    user: User;
  
    @Column()
    userEmail: string;
} 