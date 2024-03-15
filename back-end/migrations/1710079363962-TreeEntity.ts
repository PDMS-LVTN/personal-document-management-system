import { MigrationInterface, QueryRunner } from "typeorm";

export class TreeEntity1710079363962 implements MigrationInterface {
    name = 'TreeEntity1710079363962'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`note_closure\` (\`id_ancestor\` varchar(255) NOT NULL, \`id_descendant\` varchar(255) NOT NULL, INDEX \`IDX_c595484fba68bc88524030ce37\` (\`id_ancestor\`), INDEX \`IDX_924868788a237a99f9bb21e53b\` (\`id_descendant\`), PRIMARY KEY (\`id_ancestor\`, \`id_descendant\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`note_closure\` ADD CONSTRAINT \`FK_c595484fba68bc88524030ce370\` FOREIGN KEY (\`id_ancestor\`) REFERENCES \`note\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`note_closure\` ADD CONSTRAINT \`FK_924868788a237a99f9bb21e53ba\` FOREIGN KEY (\`id_descendant\`) REFERENCES \`note\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`note_closure\` DROP FOREIGN KEY \`FK_924868788a237a99f9bb21e53ba\``);
        await queryRunner.query(`ALTER TABLE \`note_closure\` DROP FOREIGN KEY \`FK_c595484fba68bc88524030ce370\``);
        await queryRunner.query(`DROP INDEX \`IDX_924868788a237a99f9bb21e53b\` ON \`note_closure\``);
        await queryRunner.query(`DROP INDEX \`IDX_c595484fba68bc88524030ce37\` ON \`note_closure\``);
        await queryRunner.query(`DROP TABLE \`note_closure\``);
    }

}