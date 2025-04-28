import { Cliente } from "./cliente.types";

export enum PaymentStatus {
  COMPLETED = 'completed',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  FAILED = 'failed',
  PENDING = 'pending',
}

export interface Payment {
  id: number;
  transactionId: string;
  amount: number;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  processedAt: string | null;
  clienteId: number;
  servicioId: number;
  cliente?: Cliente;
  servicio?: {
    id: number;
    name: string;
    descripcion: string;
    precio: number;
  };
}

export interface PaymentResponse {
  id: number;
  transactionId: string;
  amount: number;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  processedAt: string | null;
  clienteId: number;
  servicioId: number;
}

export interface PaymentListResponse {
  data: Payment[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
} 