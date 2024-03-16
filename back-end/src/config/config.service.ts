/* eslint-disable prettier/prettier */
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }
    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'mysql',

      host: this.getValue('MYSQL_HOST'),
      port: parseInt(this.getValue('MYSQL_PORT')),
      username: this.getValue('MYSQL_USER'),
      password: this.getValue('MYSQL_PASSWORD'),
      database: this.getValue('MYSQL_DATABASE'),

      entities: ['**/*.entity{.ts,.js}'],

      migrationsTableName: 'migration',

      migrations: ['./migrations/*.ts'],

      // cli: {
      //   migrationsDir: 'src/migration',
      // },

      ssl: this.isProduction(),
      synchronize: false,
      charset: 'utf8mb4',
    };
  }

  public dataSourceOptions(): DataSourceOptions {
    return {
      type: 'mysql',
      host: this.getValue('MYSQL_HOST'),
      port: parseInt(this.getValue('MYSQL_PORT')),
      username: this.getValue('MYSQL_USER'),
      password: this.getValue('MYSQL_PASSWORD'),
      database: this.getValue('MYSQL_DATABASE'),
      entities: ['**/*.entity{.ts,.js}'],
      // entities: [User, Note, Tag],
      migrationsTableName: 'migration',
      migrations: ['./migrations/*.ts'],
      ssl: this.isProduction(),
      charset: 'utf8mb4',
    };
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'MYSQL_HOST',
  'MYSQL_PORT',
  'MYSQL_USER',
  'MYSQL_PASSWORD',
  'MYSQL_DATABASE',
]);

export { configService };
