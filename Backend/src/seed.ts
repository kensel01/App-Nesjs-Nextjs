import { DataSource } from 'typeorm';
import { Cliente } from './clientes/entities/cliente.entity';
import { TipoDeServicio } from './tipos-de-servicio/entities/tipo-de-servicio.entity';
import { User } from './users/entities/user.entity';
import { Payment } from './payments/entities/payment.entity';
import { ClienteServicio } from './clientes/entities/cliente-servicio.entity';
import * as dotenv from 'dotenv';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Cargar variables de entorno
dotenv.config();

// Configuración manual de DataSource usando las variables del .env
const AppDataSource = new DataSource({
  type: 'postgres', // O el tipo de tu DB
  host: process.env.POSTGRES_HOST || 'localhost', // Usar POSTGRES_HOST
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10), // Usar POSTGRES_PORT
  username: process.env.POSTGRES_USER || 'postgres', // Usar POSTGRES_USER
  password: process.env.POSTGRES_PASSWORD || '123456', // Usar POSTGRES_PASSWORD
  database: process.env.POSTGRES_DB || 'smartisp-dev', // Usar POSTGRES_DB
  entities: [Cliente, TipoDeServicio, User, Payment, ClienteServicio],
  synchronize: false,
  ssl: process.env.POSTGRES_SSL === 'true' ? { rejectUnauthorized: false } : false, // Usar POSTGRES_SSL
});

const nuevosTiposDeServicio = [
  { name: 'Fibra Optica 100Mb', precio: 20000, description: 'Servicio de internet Fibra Óptica 100Mbps' },
  { name: 'Fibra Optica 200Mb', precio: 35000, description: 'Servicio de internet Fibra Óptica 200Mbps' },
  { name: 'Fibra Optica 400Mb', precio: 50000, description: 'Servicio de internet Fibra Óptica 400Mbps' },
  { name: 'Inalambrico 20Mb', precio: 25000, description: 'Servicio de internet Inalámbrico 20Mbps' },
  { name: 'Inalambrico 40Mb', precio: 40000, description: 'Servicio de internet Inalámbrico 40Mbps' },
];

async function runSeed() {
  console.log('Inicializando conexión a la base de datos...');
  try {
    await AppDataSource.initialize();
    console.log('Conexión establecida.');

    const clienteRepository = AppDataSource.getRepository(Cliente);
    const tipoDeServicioRepository = AppDataSource.getRepository(TipoDeServicio);

    console.log('--- Limpiando datos existentes ---');
      
    // Vaciar tabla de clientes
    const deleteClientesResult = await clienteRepository.delete({});
    console.log(`Clientes eliminados: ${deleteClientesResult.affected}`);

    // Vaciar tabla de tipos de servicio
    const deleteTiposResult = await tipoDeServicioRepository.delete({});
    console.log(`Tipos de servicio eliminados: ${deleteTiposResult.affected}`);
    
    console.log('--- Creando nuevos Tipos de Servicio ---');
    for (const tipo of nuevosTiposDeServicio) {
      const tipoData = { 
        ...tipo, 
        precio: Number(tipo.precio)
      };
      const nuevoTipo = tipoDeServicioRepository.create(tipoData);
      await tipoDeServicioRepository.save(nuevoTipo);
      console.log(`Creado: ${tipo.name} - $${tipo.precio}`);
    }

    console.log('*** Seed completado exitosamente! ***');
  } catch (error) {
    console.error('XXX Error durante el proceso de seed: XXX', error);
  } finally {
    if (AppDataSource.isInitialized) {
      console.log('Cerrando conexión a la base de datos...');
      await AppDataSource.destroy();
      console.log('Conexión cerrada.');
    }
  }
}

// Ejecutar el script
runSeed(); 