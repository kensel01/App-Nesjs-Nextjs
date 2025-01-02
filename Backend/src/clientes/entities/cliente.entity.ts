import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TipoDeServicio } from '../../tipos-de-servicio/entities/tipo-de-servicio.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Cliente {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    rut: string;

    @Column()
    telefono: string;

    @Column({ nullable: true })
    email: string;

    @Column()
    direccion: string;

    @Column()
    comuna: string;

    @Column()
    ciudad: string;

    @DeleteDateColumn()
    deletedAt: Date;

    @ManyToOne(() => TipoDeServicio, (tipoDeServicio) => tipoDeServicio.id, {
        eager: true,
    })
    tipoDeServicio: TipoDeServicio;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userEmail', referencedColumnName: 'email' })
    user: User;
  
    @Column()
    userEmail: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
} 