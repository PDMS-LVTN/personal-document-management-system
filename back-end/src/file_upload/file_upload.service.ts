import { Injectable } from '@nestjs/common';
import { CreateFileUploadDto } from './dto/create-file_upload.dto';
import { UpdateFileUploadDto } from './dto/update-file_upload.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FileUpload } from './entities/file_upload.entity';
import { Equal, Repository } from 'typeorm';

require('dotenv').config();
const fs = require('fs');
@Injectable()
export class FileUploadService {
  constructor(
    @InjectRepository(FileUpload)
    private readonly fileUploadRepository: Repository<FileUpload>,
  ) {}

  async uploadFile(files, req, note_ID) {
    files.map((file: any) => {
      const fileName = file.originalname;
      // Find matching file name between content and response array. Add right extension at the end of all urls
      req.body = {
        ...req.body,
        content: req.body.content.replace(
          fileName.substring(0, fileName.indexOf('.')),
          fileName,
        ),
      };

      const relFile: CreateFileUploadDto = {
        note_ID: '',
        path: '',
      };
      relFile.note_ID = note_ID.toString();
      relFile.path = fileName;

      // Save file path in database
      const newFileUpload = this.fileUploadRepository.create(relFile);
      this.fileUploadRepository.save(newFileUpload);
    });
  }

  findOneFileUpload(id: number) {
    return this.fileUploadRepository.findOne({
      where: { id: Equal(id) },
      relations: {
        note: true,
      },
    });
  }

  async removeFileUpload(path: string) {
    // Remove image file from destination folder
    fs.unlinkSync(`${process.env.FILE_UPLOAD_PATH}/${path}`);

    // Remove image_content item from database
    const file_upload = await this.fileUploadRepository.findOneBy({ path });
    return await this.fileUploadRepository.remove(file_upload);
  }
}
