import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFileUploadTable1709114388058 implements MigrationInterface {
  name = 'CreateFileUploadTable1709114388058';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`file_upload\` (\`id\` int NOT NULL AUTO_INCREMENT, \`path\` varchar(255) NOT NULL, \`note_ID\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_upload\` ADD CONSTRAINT \`FK_file_upload_note_ID\` FOREIGN KEY (\`note_ID\`) REFERENCES \`note\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`file_upload\` DROP FOREIGN KEY \`FK_file_upload_note_ID\``,
    );
    await queryRunner.query(`DROP TABLE \`file_upload\``);
  }
}
