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

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files[]', 20, {
      storage: diskStorage({
        destination: process.env.UPLOAD_PATH,
        filename: (req, file, cb) => {
          const fileName: string =
            path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
          const extension: string = path.parse(file.originalname).ext;

          cb(null, `${fileName}${extension}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];
        allowedMimeTypes.includes(file.mimetype)
          ? cb(null, true)
          : cb(null, false);
      },
    }),
  )
  async uploadImage(@UploadedFiles() files, @Req() req) {
    const response = [];
    files.map((file: any) => {
      const fileName = file.filename;
      if (!fileName) {
        return of(error, 'File type must be png, jpg, jpeg');
      }
      response.push(fileName);
    });

    // console.log(JSON.stringify(response));

    // Call api OCR extract text. Only images that OCR extracts text will be returned. Pass array of image's name
    const access_token = req.headers['authorization'].split(' ')[1];

    const headersRequest = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    };

    const ocr_res = this.httpService.post(
      process.env.OCR_PATH,
      JSON.stringify(response),
      {
        headers: headersRequest,
      },
    );

    const results = await (await lastValueFrom(ocr_res)).data;
    // console.log(results);

    // Map results to rel (array of dto) and pass to uploadImage service
    const rel: CreateImageContentDto[] = [];

    Object.entries(results).map((entry) => {
      const relFile: CreateImageContentDto = {
        note_ID: '',
        path: '',
        content: '',
      };
      relFile.note_ID = req.body.note_ID.toString();
      relFile.path = entry[0];
      relFile.content = entry[1] as string;
      rel.push(relFile);
    });

    console.log(rel);

    // Save image and text in database
    return this.imageContentService.uploadImage(rel);
  }

  @Get()
  findAllImageContentMatched(@Body() req: { user_id: string }) {
    return this.imageContentService.findAllImageContentMatched();
  }

  @Get(':id')
  findOneImageContent(@Param('id') id: number) {
    return this.imageContentService.findOneImageContent(id);
  }

  @Delete()
  removeImageContent(@Body() req: { path: string }) {
    return this.imageContentService.removeImageContent(req.path);
  }
}
