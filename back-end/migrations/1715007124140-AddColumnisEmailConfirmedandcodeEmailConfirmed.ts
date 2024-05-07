import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnisEmailConfirmedandcodeEmailConfirmed1715007124140
  implements MigrationInterface
{
  name = 'AddColumnisEmailConfirmedandcodeEmailConfirmed1715007124140';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`isEmailConfirmed\` tinyint NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`codeEmailConfirmed\` varchar(255) DEFAULT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`resetPasswordToken\` varchar(255) DEFAULT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP COLUMN \`codeEmailConfirmed\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP COLUMN \`isEmailConfirmed\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP COLUMN \`resetPasswordToken\``,
    );
  }
}
