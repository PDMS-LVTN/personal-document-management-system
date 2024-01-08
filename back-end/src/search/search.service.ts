// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { ElasticsearchService } from '@nestjs/elasticsearch';
// import { InjectRepository } from '@nestjs/typeorm';
// import { query } from 'express';
// import { Repository } from 'typeorm';

// @Injectable()
// export class SearchService {
//   constructor(
//     private readonly esService: ElasticsearchService,
//     private readonly configService: ConfigService,
//   ) {}

//   async createIndex() {
//     const index = this.configService.get('ELASTICSEARCH_INDEX');
//     const checkIndex = await this.esService.indices.exists({ index });
//     if (!checkIndex) {
//       this.esService.indices.create(
//         {
//           index: this.configService.get('ELASTICSEARCH_INDEX'),
//           body: {
//             mappings: {
//               properties: {
//                 content: {
//                   type: 'text',
//                   fields: {
//                     keyword: {
//                       type: 'keyword',
//                       ignore_above: 256,
//                     },
//                   },
//                 },
//               },
//             },
//             settings: {
//               analysis: {
//                 filter: {
//                   autocomplete_filter: {
//                     type: 'edge_ngram',
//                     min_gram: 1,
//                     max_gram: 20,
//                   },
//                 },
//                 analyzer: {
//                   autocomplete: {
//                     type: 'custom',
//                     tokenizer: 'standard',
//                     filter: ['lowercase', 'autocomplete_filter'],
//                   },
//                 },
//               },
//             },
//           },
//         },
//         // (err: any) => {
//         //   if (err) {
//         //     console.error(err);
//         //   }
//         // },
//       );
//     }
//   }

//   async indexImageContent(image_content: any) {
//     const a = await this.esService.index({
//       index: this.configService.get('ELASTICSEARCH_INDEX')!,
//       body: image_content,
//     });
//     console.log(a);
//   }

//   async remove(image_content_id: number) {
//     this.esService.deleteByQuery({
//       index: this.configService.get('ELASTICSEARCH_INDEX')!,
//       body: {
//         query: {
//           match: {
//             id: image_content_id,
//           },
//         },
//       },
//     });
//   }

//   async search(text: string) {
//     console.log(text);
//     const body = await this.esService.search<any>({
//       index: this.configService.get('ELASTICSEARCH_INDEX'),
//       body: {
//         query: {
//           multi_match: {
//             query: text,
//             fields: ['content'],
//           },
//         },
//       },
//     });
//     const hits = body.hits.hits;
//     return hits.map((item) => item._source);
//   }
// }
