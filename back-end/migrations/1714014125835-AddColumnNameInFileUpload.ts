import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnNameInFileUpload1714014125835
  implements MigrationInterface
{
  name = 'AddColumnNameInFileUpload1714014125835';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`file_upload\` ADD \`name\` VARCHAR(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`file_upload\` DROP COLUMN \`name\``);
  }
}
