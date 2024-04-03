import { MigrationInterface, QueryRunner } from "typeorm";

export class FullTextIndex1711131297177 implements MigrationInterface {
    name = 'FullTextIndex1711131297177'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE FULLTEXT INDEX \`IDX_743a213972a8d5fe7f16f5908b\` ON \`image_content\` (\`content\`)`);
        await queryRunner.query(`CREATE FULLTEXT INDEX \`IDX_c1872643429ea977256802b097\` ON \`note\` (\`title\`)`);
        await queryRunner.query(`CREATE FULLTEXT INDEX \`IDX_e78ea213ea304810c373096d7c\` ON \`note\` (\`content\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_e78ea213ea304810c373096d7c\` ON \`note\``);
        await queryRunner.query(`DROP INDEX \`IDX_c1872643429ea977256802b097\` ON \`note\``);
        await queryRunner.query(`DROP INDEX \`IDX_743a213972a8d5fe7f16f5908b\` ON \`image_content\``);
    }

}
