import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsActiveToUsers1712108400000 implements MigrationInterface {
  name = 'AddIsActiveToUsers1712108400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isActive" boolean NOT NULL DEFAULT true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isActive"`);
  }
}
