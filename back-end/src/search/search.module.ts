// import { Module, OnModuleInit, Search } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { SearchService } from './search.service';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { ElasticsearchModule } from '@nestjs/elasticsearch';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([Search]),
//     ElasticsearchModule.registerAsync({
//       imports: [ConfigModule],
//       useFactory: async (configService: ConfigService) => ({
//         node: configService.get('ELASTICSEARCH_NODE'),
//         maxRetries: 10,
//         requestTimeout: 60000,
//         pingTimeout: 60000,
//         sniffOnStart: true,
//       }),
//       inject: [ConfigService],
//     }),
//     ConfigModule,
//   ],
//   providers: [SearchService, ConfigService],
//   exports: [SearchService, ElasticsearchModule],
// })
// export class SearchModule implements OnModuleInit {
//   constructor(private searchService: SearchService) {}
//   onModuleInit() {
//     this.searchService.createIndex().then();
//   }
// }
