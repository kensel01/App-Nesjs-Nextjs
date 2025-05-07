import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropInstalacionesTable1712108400002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Primero eliminamos las restricciones de clave externa si existen
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.table_constraints 
          WHERE constraint_name = 'instalaciones_clienteId_fkey' 
          AND table_name = 'instalaciones'
        ) THEN
          ALTER TABLE "instalaciones" DROP CONSTRAINT "instalaciones_clienteId_fkey";
        END IF;
        
        IF EXISTS (
          SELECT 1 FROM information_schema.table_constraints 
          WHERE constraint_name = 'instalaciones_clienteServicioId_fkey' 
          AND table_name = 'instalaciones'
        ) THEN
          ALTER TABLE "instalaciones" DROP CONSTRAINT "instalaciones_clienteServicioId_fkey";
        END IF;
      END $$;
    `);

    // Luego eliminamos la tabla
    await queryRunner.query(`DROP TABLE IF EXISTS "instalaciones"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // No implementamos la restauración de la tabla, ya que estamos eliminando esta funcionalidad
    console.log('Esta migración no se puede revertir porque se ha eliminado la tabla de instalaciones permanentemente');
  }
} 