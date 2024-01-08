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

  // @Post('upload')
  // @UseInterceptors(
  //   FilesInterceptor('files[]', 20, {
  //     storage: diskStorage({
  //       destination: process.env.UPLOAD_PATH,
  //       filename: (req, file, cb) => {
  //         // console.log(req.body);
  //         const fileName: string = path
  //           .parse(file.originalname)
  //           .name.replace(/\s/g, '');
  //         //   const pos = req.body.urls[idx].lastIndexOf('/');
  //         // const fileName = req.body.urls[idx].substring(pos + 1) + extension;
  //         //   const fileName: string =
  //         const extension: string = path.parse(file.originalname).ext;

  //         cb(null, `${fileName}${extension}`);
  //       },
  //     }),
  //     fileFilter: (req, file, cb) => {
  //       const allowedMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];
  //       allowedMimeTypes.includes(file.mimetype)
  //         ? cb(null, true)
  //         : cb(null, false);
  //     },
  //   }),
  // )
  // async uploadImage(@UploadedFiles() files, @Req() req) {

  @Get('search')
  searchImageContent(@Req() req: { user_id: string; keyword: string }) {
    return this.imageContentService.searchImageContent(req);
  }

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
}
