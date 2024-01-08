import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDb1700932210177 implements MigrationInterface {
  name = 'CreateDb1700932210177';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`tag\` (\`id\` varchar(36) NOT NULL, \`description\` varchar(255) NOT NULL, \`note_ID\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`refresh_token\` text NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`note\` (\`id\` varchar(36) NOT NULL, \`title\` longtext NOT NULL, \`content\` longtext NULL, \`size\` int NOT NULL, \`read_only\` tinyint NOT NULL DEFAULT 0, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`parent_id\` varchar(36) NULL, \`user_id\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`favorite_note\` (\`id\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`recent_note\` (\`id\` varchar(36) NOT NULL, \`last_accessed\` timestamp NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`image_content\` (\`id\` int NOT NULL AUTO_INCREMENT, \`path\` varchar(255) NOT NULL, \`content\` longtext NOT NULL, \`note_ID\` varchar(36) NOT NULL, UNIQUE INDEX \`REL_3ee135f9dac26c491ef1dd24a3\` (\`note_ID\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`pinned_note\` (\`id\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`links\` (\`headlink_id\` varchar(36) NOT NULL, \`backlink_id\` varchar(36) NOT NULL, INDEX \`IDX_67e2024ba04e174e16c82ae707\` (\`headlink_id\`), INDEX \`IDX_14324d7ad015f81511236aeae8\` (\`backlink_id\`), PRIMARY KEY (\`headlink_id\`, \`backlink_id\`)) ENGINE=InnoDB`,
    );
    // await queryRunner.query(`ALTER TABLE \`note\` DROP COLUMN \`parent_id\``);
    // await queryRunner.query(
    //   `ALTER TABLE \`note\` ADD \`parent_id\` varchar(255) NULL`,
    // );
    // await queryRunner.query(`ALTER TABLE \`note\` DROP COLUMN \`user_id\``);
    // await queryRunner.query(
    //   `ALTER TABLE \`note\` ADD \`user_id\` varchar(255) NOT NULL`,
    // );
    // await queryRunner.query(`ALTER TABLE \`tag\` DROP PRIMARY KEY`);
    // await queryRunner.query(`ALTER TABLE \`tag\` DROP COLUMN \`id\``);
    // await queryRunner.query(
    //   `ALTER TABLE \`tag\` ADD \`id\` int NOT NULL PRIMARY KEY AUTO_INCREMENT`,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE \`tag\` CHANGE \`description\` \`description\` varchar(255) NOT NULL`,
    // );
    // await queryRunner.query(`ALTER TABLE \`tag\` DROP COLUMN \`note_ID\``);
    // await queryRunner.query(
    //   `ALTER TABLE \`tag\` ADD \`note_ID\` varchar(255) NOT NULL`,
    // );
    await queryRunner.query(
      `ALTER TABLE \`tag\` ADD CONSTRAINT \`FK_23021eeb5033c0432d79373d41b\` FOREIGN KEY (\`note_ID\`) REFERENCES \`note\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`note\` ADD CONSTRAINT \`FK_9dc0e44ffc970250c1b0057ef90\` FOREIGN KEY (\`parent_id\`) REFERENCES \`note\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`note\` ADD CONSTRAINT \`FK_654d6da35fcab12c3905725a416\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`favorite_note\` ADD CONSTRAINT \`FK_95efbdda6f0014bf290e190e461\` FOREIGN KEY (\`id\`) REFERENCES \`note\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`recent_note\` ADD CONSTRAINT \`FK_7cd989d9a9f5d7846e9e59b3909\` FOREIGN KEY (\`id\`) REFERENCES \`note\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`image_content\` ADD CONSTRAINT \`FK_3ee135f9dac26c491ef1dd24a31\` FOREIGN KEY (\`note_ID\`) REFERENCES \`note\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`pinned_note\` ADD CONSTRAINT \`FK_143ce7b799c11fc0953d54e640c\` FOREIGN KEY (\`id\`) REFERENCES \`note\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`links\` ADD CONSTRAINT \`FK_67e2024ba04e174e16c82ae707e\` FOREIGN KEY (\`headlink_id\`) REFERENCES \`note\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`links\` ADD CONSTRAINT \`FK_14324d7ad015f81511236aeae8f\` FOREIGN KEY (\`backlink_id\`) REFERENCES \`note\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`links\` DROP FOREIGN KEY \`FK_14324d7ad015f81511236aeae8f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`links\` DROP FOREIGN KEY \`FK_67e2024ba04e174e16c82ae707e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`pinned_note\` DROP FOREIGN KEY \`FK_143ce7b799c11fc0953d54e640c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`image_content\` DROP FOREIGN KEY \`FK_3ee135f9dac26c491ef1dd24a31\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`recent_note\` DROP FOREIGN KEY \`FK_7cd989d9a9f5d7846e9e59b3909\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`favorite_note\` DROP FOREIGN KEY \`FK_95efbdda6f0014bf290e190e461\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`note\` DROP FOREIGN KEY \`FK_654d6da35fcab12c3905725a416\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`note\` DROP FOREIGN KEY \`FK_9dc0e44ffc970250c1b0057ef90\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`tag\` DROP FOREIGN KEY \`FK_23021eeb5033c0432d79373d41b\``,
    );
    // await queryRunner.query(`ALTER TABLE \`tag\` DROP COLUMN \`note_ID\``);
    // await queryRunner.query(
    //   `ALTER TABLE \`tag\` ADD \`note_ID\` varchar(36) NULL`,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE \`tag\` CHANGE \`description\` \`description\` varchar(255) NOT NULL`,
    // );
    // await queryRunner.query(`ALTER TABLE \`tag\` DROP COLUMN \`id\``);
    // await queryRunner.query(
    //   `ALTER TABLE \`tag\` ADD \`id\` varchar(36) NOT NULL`,
    // );
    // await queryRunner.query(`ALTER TABLE \`tag\` ADD PRIMARY KEY (\`id\`)`);
    // await queryRunner.query(`ALTER TABLE \`note\` DROP COLUMN \`user_id\``);
    // await queryRunner.query(
    //   `ALTER TABLE \`note\` ADD \`user_id\` varchar(36) NOT NULL`,
    // );
    // await queryRunner.query(`ALTER TABLE \`note\` DROP COLUMN \`parent_id\``);
    // await queryRunner.query(
    //   `ALTER TABLE \`note\` ADD \`parent_id\` varchar(36) NULL`,
    // );
    await queryRunner.query(
      `DROP INDEX \`IDX_14324d7ad015f81511236aeae8\` ON \`links\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_67e2024ba04e174e16c82ae707\` ON \`links\``,
    );
    await queryRunner.query(`DROP TABLE \`links\``);
    await queryRunner.query(`DROP TABLE \`pinned_note\``);
    await queryRunner.query(
      `DROP INDEX \`REL_3ee135f9dac26c491ef1dd24a3\` ON \`image_content\``,
    );
    await queryRunner.query(`DROP TABLE \`image_content\``);
    await queryRunner.query(`DROP TABLE \`recent_note\``);
    await queryRunner.query(`DROP TABLE \`favorite_note\``);
    await queryRunner.query(`DROP TABLE \`note\``);
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(`DROP TABLE \`tag\``);
  }
}
