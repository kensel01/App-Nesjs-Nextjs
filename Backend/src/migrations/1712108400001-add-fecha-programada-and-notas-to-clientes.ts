import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFechaProgramadaAndNotasToClientes1712108400001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "cliente" 
      ADD COLUMN "fechaProgramada" DATE NOT NULL DEFAULT CURRENT_DATE,
      ADD COLUMN "notas" VARCHAR(300)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "cliente" 
      DROP COLUMN "fechaProgramada",
      DROP COLUMN "notas"
    `);
  }
} 