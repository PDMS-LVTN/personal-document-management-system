import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateImageContentDto } from './dto/create-image_content.dto';
import { UpdateImageContentDto } from './dto/update-image_content.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageContent } from './entities/image_content.entity';
import { Equal, Repository } from 'typeorm';
import { Note } from 'src/note/entities/note.entity';
import { catchError, lastValueFrom, of } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { error } from 'console';
// import { SearchService } from '../search/search.service';
// /search/search.service';

require('dotenv').config();
const fs = require('fs');
@Injectable()
export class ImageContentService {
  constructor(
    @InjectRepository(ImageContent)
    private readonly imageContentRepository: Repository<ImageContent>,
    // private readonly searchService: SearchService,
    private readonly httpService: HttpService,
  ) {}

  async uploadImage(files, req, note_ID) {
    const response = [];
    files.map((file: any) => {
      const fileName = file.originalname;
      if (!fileName) {
        return of(error, 'File type must be png, jpg, jpeg');
      }
      response.push(fileName);
      // Find matching file name between content and response array. Add right extension at the end of all urls
      req.body.content = req.body.content.replace(
        fileName.substring(0, fileName.indexOf('.')),
        fileName,
      );
    });

    // Call api OCR extract text. Only images that OCR extracts text will be returned. Pass array of image's name
    const access_token = req.headers['authorization'].split(' ')[1];

    const headersRequest = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    };

    const ocr_res = await lastValueFrom(
      this.httpService
        .post(process.env.OCR_PATH, JSON.stringify(response), {
          headers: headersRequest,
        })
        .pipe(
          catchError((error) => {
            throw new HttpException(
              'An error occurred during the OCR request',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }),
        ),
    );

    const results = ocr_res.data;

    // Map results to rel (array of dto) and pass to uploadImage service
    const rel: CreateImageContentDto[] = [];

    Object.entries(results).map((entry) => {
      const relFile: CreateImageContentDto = {
        note_ID: '',
        path: '',
        content: '',
      };
      relFile.note_ID = note_ID.toString();
      relFile.path = entry[0];
      relFile.content = entry[1] as string;
      rel.push(relFile);
    });

    console.log(rel);

    // Save image and text in database
    return this.updateImageContent(rel);
  }

  async updateImageContent(createImageContentDtos: CreateImageContentDto[]) {
    createImageContentDtos.map((e) => {
      const newImageContent = this.imageContentRepository.create(e);
      this.imageContentRepository.save(newImageContent);
      // this.searchService.indexImageContent(e);
    });
  }

  searchImageContent(req) {
    // Return all notes that match keyword and search results only for one user's image_content.

    // Using full text search of MySQL, QUERY EXPANSION MODE. Faster with index compared with LIKE commands.
    // Full text search can search keyword Vietnamese without accents when Vietnamese is stored. But searching result of separated words with multiple words leads to stuck with a lot of irrelevant matches.
    // "QUERY EXPANSION" will search with related keywords, multiple words will search for separated words.
    // "BOOLEAN MODE" can search for exact keywords, can not search with related keywords.
    const searchQuery = req.body.keyword;

    return this.imageContentRepository
      .createQueryBuilder('image_content')
      .innerJoinAndSelect('image_content.note', 'note', 'note.user_id = :id', {
        id: req.body.user_id,
      })
      .select(['note_ID as id', 'note.title AS title'])
      .where(
        `MATCH(image_content.content) AGAINST ('${searchQuery}' WITH QUERY EXPANSION)`,
      )
      .getRawMany();
  }

  // elasticSearchImageContent(req) {
  //   // Return all notes that match keyword and search results only for one user's image_content.
  //   // Using ElasticSearch
  //   return this.searchService.search(req.body.keyword);
  // }

  findOneImageContent(id: number) {
    return this.imageContentRepository.findOne({
      where: { id: Equal(id) },
      relations: {
        note: true,
      },
    });
  }

  async removeImageContent(path: string) {
    // Remove image file from destination folder
    fs.unlinkSync(`${process.env.UPLOAD_PATH}/${path}`);

    // Remove image_content item from database
    const image_content = await this.imageContentRepository.findOneBy({ path });
    return await this.imageContentRepository.remove(image_content);
  }
}
