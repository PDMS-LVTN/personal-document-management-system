import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateGeneralAccess1715354734456 implements MigrationInterface {
    name = 'UpdateGeneralAccess1715354734456'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`note\` DROP COLUMN \`is_anyone\``);
        await queryRunner.query(`ALTER TABLE \`note\` ADD \`is_anyone\` enum ('comment', 'view', 'edit') NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`note\` DROP COLUMN \`is_anyone\``);
        await queryRunner.query(`ALTER TABLE \`note\` ADD \`is_anyone\` tinyint NOT NULL DEFAULT '0'`);
    }

}
