import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropTableAndUniqueReferenceImageContent1703834963777
  implements MigrationInterface
{
  name = 'DropTableAndUniqueReferenceImageContent1703834963777';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`DROP TABLE \`recent_note\``);
    // await queryRunner.query(`DROP TABLE \`favorite_note\``);
    // await queryRunner.query(`DROP TABLE \`pinned_note\``);
    // await queryRunner.query(
    //   `ALTER TABLE \`note\` ADD \`is_favorited\` tinyint NOT NULL`,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE \`note\` ADD \`is_pinned\` tinyint NOT NULL`,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE \`image_content\` DROP FOREIGN KEY \`FK_3ee135f9dac26c491ef1dd24a31\``,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE \`image_content\` DROP INDEX \`REL_3ee135f9dac26c491ef1dd24a3\``,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE \`image_content\` ADD CONSTRAINT \`FK_3ee135f9dac26c491ef1dd24a31\` FOREIGN KEY (\`note_ID\`) REFERENCES \`note\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    // );
    await queryRunner.query(
      `CREATE TABLE \`applies\` (\`tag_id\` varchar(36) NOT NULL, \`note_id\` varchar(36) NOT NULL, INDEX \`IDX_tag_id\` (\`tag_id\`), INDEX \`IDX_note_id\` (\`note_id\`), PRIMARY KEY (\`tag_id\`, \`note_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`applies\` ADD CONSTRAINT \`FK_tag_id\` FOREIGN KEY (\`tag_id\`) REFERENCES \`tag\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`applies\` ADD CONSTRAINT \`FK_note_id\` FOREIGN KEY (\`note_id\`) REFERENCES \`note\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`favorite_note\` (\`id\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`recent_note\` (\`id\` varchar(36) NOT NULL, \`last_accessed\` timestamp NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`pinned_note\` (\`id\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`note\` DROP COLUMN \`is_favorited\``,
    );
    await queryRunner.query(`ALTER TABLE \`note\` DROP COLUMN \`is_pinned\``);
    await queryRunner.query(
      `ALTER TABLE \`image_content\` ADD CONSTRAINT \`FK_3ee135f9dac26c491ef1dd24a31\` FOREIGN KEY (\`note_ID\`) REFERENCES \`note\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`image_content\` ADD CONSTRAINT \`REL_3ee135f9dac26c491ef1dd24a3\` UNIQUE (\`note_ID\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`image_content\` DROP FOREIGN KEY \`FK_3ee135f9dac26c491ef1dd24a31\``,
    );
    await queryRunner.query(`DROP TABLE \`applies\``);
    await queryRunner.query(
      `ALTER TABLE \`applies\` DROP FOREIGN KEY \`FK_tag_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`applies\` DROP FOREIGN KEY \`FK_note_id\``,
    );
    await queryRunner.query(`DROP INDEX \`IDX_tag_id\` ON \`applies\``);
    await queryRunner.query(`DROP INDEX \`IDX_note_id\` ON \`applies\``);
  }
}
