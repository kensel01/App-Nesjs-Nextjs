import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { TipoDeServicio } from '../../tipos-de-servicio/entities/tipo-de-servicio.entity';

export enum PaymentStatus {
  COMPLETED = 'completed',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  FAILED = 'failed',
  PENDING = 'pending',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  transactionId: string;

  @Column()
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true, type: 'timestamp' })
  processedAt: Date;

  @ManyToOne(() => Cliente, (cliente) => cliente.payments)
  @JoinColumn({ name: 'clienteId' })
  cliente: Cliente;

  @Column()
  clienteId: number;

  @ManyToOne(() => TipoDeServicio, (servicio) => servicio.payments)
  @JoinColumn({ name: 'servicioId' })
  servicio: TipoDeServicio;

  @Column()
  servicioId: number;
}
