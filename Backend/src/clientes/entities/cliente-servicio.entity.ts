import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Cliente } from './cliente.entity';
import { TipoDeServicio } from '../../tipos-de-servicio/entities/tipo-de-servicio.entity';

@Entity('cliente_servicios')
export class ClienteServicio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clienteId: number;

  @ManyToOne(() => Cliente, cliente => cliente.servicios)
  @JoinColumn({ name: 'clienteId' })
  cliente: Cliente;

  @Column()
  tipoDeServicioId: number;

  @ManyToOne(() => TipoDeServicio)
  @JoinColumn({ name: 'tipoDeServicioId' })
  tipoDeServicio: TipoDeServicio;

  @Column({ default: true })
  activo: boolean;

  @Column({ default: false })
  suspendido: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  precioMensual: number;

  @Column({ nullable: true, type: 'date' })
  fechaInstalacion: Date;

  @Column({ nullable: true, type: 'date' })
  fechaSuspension: Date;

  @Column({ nullable: true })
  direccionInstalacion: string;

  @Column({ type: 'text', nullable: true })
  notas: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 