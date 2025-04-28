import { Cliente } from '../../clientes/entities/cliente.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Payment } from '../../payments/entities/payment.entity';

@Entity()
export class TipoDeServicio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
    unique: true,
    nullable: false,
  })
  name: string;

  @Column({
    length: 500,
    nullable: true,
  })
  description: string;

  @Column({
    default: true,
  })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Cliente, (cliente) => cliente.tipoDeServicio)
  clientes: Cliente[];

  @OneToMany(() => Payment, (payment) => payment.servicio)
  payments: Payment[];
}
