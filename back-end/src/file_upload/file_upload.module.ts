import { Module } from '@nestjs/common';
import { FileUploadService } from './file_upload.service';
import { FileUploadController } from './file_upload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileUpload } from './entities/file_upload.entity';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([FileUpload])],
  controllers: [FileUploadController],
  providers: [FileUploadService, ConfigService],
  exports: [FileUploadService],
})
export class FileUploadModule {}
