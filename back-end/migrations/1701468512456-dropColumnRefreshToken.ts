import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropColumnRefreshToken1701468512456 implements MigrationInterface {
  name = 'DropColumnRefreshToken1701468512456';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP COLUMN \`refresh_token\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`refresh_token\` text NOT NULL`,
    );
  }
}
