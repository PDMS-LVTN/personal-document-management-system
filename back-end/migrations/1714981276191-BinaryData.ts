import { MigrationInterface, QueryRunner } from "typeorm";

export class BinaryData1714981276191 implements MigrationInterface {
    name = 'BinaryData1714981276191'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`note\` ADD \`binary_update_data\` blob NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`note\` DROP COLUMN \`binary_update_data\``);
    }

}
