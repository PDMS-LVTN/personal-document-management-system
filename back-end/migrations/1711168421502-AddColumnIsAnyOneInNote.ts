import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnIsAnyOneInNote1711168421502
  implements MigrationInterface
{
  name = "AddColumnIsAnyOneInNote1711168421502";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`note\` ADD \`is_anyone\` tinyint NOT NULL DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`note\` DROP COLUMN \`is_anyone\``);
  }
}
