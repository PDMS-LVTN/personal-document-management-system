import { MigrationInterface, QueryRunner } from "typeorm";

export class SharedDate1715403994637 implements MigrationInterface {
    name = 'SharedDate1715403994637'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`note_collaborator\` ADD \`shared_date\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`note\` ADD \`shared_date\` timestamp NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`note\` DROP COLUMN \`shared_date\``);
        await queryRunner.query(`ALTER TABLE \`note_collaborator\` DROP COLUMN \`shared_date\``);
    }
}
