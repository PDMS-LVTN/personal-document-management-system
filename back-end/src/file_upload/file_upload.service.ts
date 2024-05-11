import { Injectable } from '@nestjs/common';
import { CreateFileUploadDto } from './dto/create-file_upload.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FileUpload } from './entities/file_upload.entity';
import { Equal, Repository } from 'typeorm';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

require('dotenv').config();
const fs = require('fs');
@Injectable()
export class FileUploadService {
  private readonly s3Client = new S3({
    region: this.configService.get('AWS_S3_REGION'),
    accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY_ID'),
    secretAccessKey: this.configService.get('AWS_S3_SECRET_ACCESS_KEY'),
  });

  constructor(
    @InjectRepository(FileUpload)
    private readonly fileUploadRepository: Repository<FileUpload>,
    private readonly configService: ConfigService,
  ) {}

  async uploadFile(files, req, note_ID: string, direct = false) {
    let urls = [];
    files.map(async (file: any) => {
      const data = JSON.parse(req.body.data);
      const fileName = file.originalname;
      // Find matching file name between content and response array. Add right extension at the end of all urls
      if (!direct)
        req.body = {
          ...req.body,
          content: req.body.content.replace(
            fileName.substring(0, fileName.indexOf('.')),
            fileName,
          ),
        };

      if (process.env.DEBUG === '1') {
        const bucket = this.configService.get('AWS_S3_BUCKET');
        const inputUpload = {
          Body: file.buffer,
          Bucket: bucket,
          Key: fileName,
          ContentType: file.mimetype,
          // ACL: 'public-read',
        };
        try {
          await this.s3Client.upload(inputUpload).promise();
        } catch (err) {
          throw err;
        }
      }

      const relFile: CreateFileUploadDto = {
        note_ID: '',
        path: '',
        name: '',
      };
      relFile.note_ID = note_ID.toString();
      relFile.path = fileName;
      relFile.name = data.fileName;
      urls.push(`${process.env.IMAGE_SERVER_PATH}/${relFile.path}`);

      // Save file path in database
      const newFileUpload = this.fileUploadRepository.create(relFile);
      this.fileUploadRepository.save(newFileUpload);
    });
    return urls;
  }

  async findOneFileUpload(id: number) {
    return await this.fileUploadRepository.findOne({
      where: { id: Equal(id) },
      relations: {
        note: true,
      },
    });
  }

  async removeFileUpload(path: string) {
    // Remove image file from destination folder
    if (process.env.DEBUG === '0') {
      fs.unlinkSync(`${process.env.UPLOAD_PATH}/${path}`);
    } else {
      const params = {
        Bucket: this.configService.get('AWS_S3_BUCKET'),
        Key: path,
      };
      try {
        await this.s3Client.deleteObject(params).promise();
      } catch (err) {
        throw err;
      }
    }

    // Remove image_content item from database
    const file_upload = await this.fileUploadRepository.findOneBy({ path });
    return await this.fileUploadRepository.remove(file_upload);
  }

  async findFilesOfNote(req) {
    return await this.fileUploadRepository.find({
      select: {
        name: true,
        path: true,
      },
      where: {
        note_ID: Equal(req.note_ID),
      },
    });
  }
}
