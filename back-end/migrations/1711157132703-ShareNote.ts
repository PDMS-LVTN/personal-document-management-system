import { MigrationInterface, QueryRunner } from 'typeorm';

export class ShareNote1711157132703 implements MigrationInterface {
  name = 'ShareNote1711157132703';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`note_collaborator\` (\`note_id\` varchar(36) NOT NULL, 
                    \`email\` varchar(255) NOT NULL, \`share_mode\` enum('full', 'edit', 'view') NOT NULL , INDEX \`IDX_note\` (\`note_id\`), PRIMARY KEY (\`note_id\`, \`email\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`note_collaborator\` ADD CONSTRAINT \`FK_note\` FOREIGN KEY (\`note_id\`) REFERENCES \`note\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`note_collaborator\` DROP FOREIGN KEY \`FK_note\``,
    );
    await queryRunner.query(`DROP INDEX \`IDX_note\` ON \`note_collaborator\``);
    await queryRunner.query(`DROP TABLE \`note_collaborator\``);
  }
}
