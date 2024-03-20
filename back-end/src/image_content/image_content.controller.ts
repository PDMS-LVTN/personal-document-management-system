import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
  Request,
  UploadedFiles,
  ForbiddenException,
} from '@nestjs/common';
import { ImageContentService } from './image_content.service';
// import { CreateImageContentDto } from './dto/create-image_content.dto';
import { UpdateImageContentDto } from './dto/update-image_content.dto';
import { ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import {
  Observable,
  catchError,
  firstValueFrom,
  lastValueFrom,
  map,
  of,
} from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { error } from 'console';
import { CreateImageContentDto } from './dto/create-image_content.dto';
require('dotenv').config();

@ApiTags('image_content')
@Controller('api/image_content/')
export class ImageContentController {
  constructor(
    private readonly imageContentService: ImageContentService,
    private readonly httpService: HttpService,
  ) {}

  // @Get('search')
  // searchImageContent(@Req() req: { user_id: string; keyword: string }) {
  //   return this.imageContentService.searchImageContent(req);
  // }

  // @Get('elastic_search')
  // elasticSearchImageContent(@Req() req: { user_id: string; keyword: string }) {
  //   return this.imageContentService.elasticSearchImageContent(req);
  // }

  @Get(':id')
  findOneImageContent(@Param('id') id: number) {
    return this.imageContentService.findOneImageContent(id);
  }

  @Delete()
  removeImageContent(@Body() req: { path: string }) {
    return this.imageContentService.removeImageContent(req.path);
  }

  @Post('extract_text')
  async extractText(@Body() req: { note_ID: string; path: string }) {
    return await this.imageContentService.extractText(req);
  }
}
