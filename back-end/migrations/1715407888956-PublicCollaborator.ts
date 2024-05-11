import { MigrationInterface, QueryRunner } from "typeorm";

export class PublicCollaborator1715407888956 implements MigrationInterface {
    name = 'PublicCollaborator1715407888956'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`public_collaborator\` (\`note_id\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, PRIMARY KEY (\`note_id\`, \`email\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`public_collaborator\` ADD CONSTRAINT \`FK_cff449dea44717dbad6d717a8b3\` FOREIGN KEY (\`note_id\`) REFERENCES \`note\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`public_collaborator\` DROP FOREIGN KEY \`FK_cff449dea44717dbad6d717a8b3\``);
        await queryRunner.query(`DROP TABLE \`public_collaborator\``);
    }
}
