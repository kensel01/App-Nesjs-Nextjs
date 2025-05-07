import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { TipoDeServicio } from '../../tipos-de-servicio/entities/tipo-de-servicio.entity';
import { User } from '../../users/entities/user.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { ClienteServicio } from './cliente-servicio.entity';

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

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  fechaProgramada: Date;
  
  @Column({ type: 'varchar', length: 300, nullable: true })
  notas: string;

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

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(() => Payment, (payment) => payment.cliente)
  payments: Payment[];

  @OneToMany(() => ClienteServicio, (clienteServicio) => clienteServicio.cliente)
  servicios: ClienteServicio[];
}
