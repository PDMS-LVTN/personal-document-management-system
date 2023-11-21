/* eslint-disable prettier/prettier */
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    // console.log(this.env)
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
    // console.log(this.getValue('PORT', true));
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

      migrations: ['src/migration/*.ts'],

    //   cli: {
    //     migrationsDir: 'src/migration',
    //   },

      ssl: this.isProduction(),
    //   synchronize: true,
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
