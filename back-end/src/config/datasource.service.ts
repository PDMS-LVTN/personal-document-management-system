/* eslint-disable prettier/prettier */
import { DataSource } from 'typeorm';
import { configService } from './config.service';

const dataSource = new DataSource(configService.dataSourceOptions());
export default dataSource;