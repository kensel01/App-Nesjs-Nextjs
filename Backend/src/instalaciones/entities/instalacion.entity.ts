import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { ClienteServicio } from '../../clientes/entities/cliente-servicio.entity';

// Estado de la instalación
export enum EstadoInstalacion {
  PENDIENTE = 'pendiente',
  EN_PROCESO = 'en_proceso',
  COMPLETADA = 'completada',
  CANCELADA = 'cancelada',
}

@Entity('instalaciones')
export class Instalacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: EstadoInstalacion,
    default: EstadoInstalacion.PENDIENTE
  })
  estado: EstadoInstalacion;

  @Column({ type: 'date' })
  fechaProgramada: Date;

  @Column({ type: 'time', nullable: true })
  horaInicio: string;
  
  @Column({ type: 'time', nullable: true })
  horaFin: string;

  @Column()
  clienteServicioId: number;

  @ManyToOne(() => ClienteServicio)
  @JoinColumn({ name: 'clienteServicioId' })
  clienteServicio: ClienteServicio;

  @Column()
  clienteId: number;

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: 'clienteId' })
  cliente: Cliente;

  @Column({ nullable: true })
  direccion: string;

  @Column({ nullable: true })
  comuna: string;

  @Column({ nullable: true })
  ciudad: string;

  @Column({ nullable: true })
  nombreTecnico: string;

  @Column({ nullable: true })
  telefonoTecnico: string;

  @Column({ type: 'text', nullable: true })
  notas: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 