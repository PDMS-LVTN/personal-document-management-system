import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { FileUploadService } from './file_upload.service';
import { CreateFileUploadDto } from './dto/create-file_upload.dto';
import { UpdateFileUploadDto } from './dto/update-file_upload.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path = require('path');
import { ApiTags } from '@nestjs/swagger';

@ApiTags('file_upload')
@Controller('api/file_upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post(':id')
  @UseInterceptors(
    FilesInterceptor('files[]', 20, {
      storage: diskStorage({
        destination: process.env.FILE_UPLOAD_PATH,
        filename: (req, file, cb) => {
          const fileName: string = path
            .parse(file.originalname)
            .name.replace(/\s/g, '');
          const extension: string = path.parse(file.originalname).ext;
          cb(null, `${fileName}${extension}`);
        },
      }),
    }),
  )
  async uploadFile(
    @Param('id') id: string,
    @UploadedFiles() files,
    @Req() req,
  ) {
    return await this.fileUploadService
      .uploadFile(files, req, id)
      .catch((err) => {
        throw err;
      });
  }

  @Get(':id')
  findOneImageContent(@Param('id') id: number) {
    return this.fileUploadService.findOneFileUpload(id);
  }

  @Delete()
  removeImageContent(@Body() req: { path: string }) {
    return this.fileUploadService.removeFileUpload(req.path);
  }
}
