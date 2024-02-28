import { Module } from '@nestjs/common';
import { FileUploadService } from './file_upload.service';
import { FileUploadController } from './file_upload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileUpload } from './entities/file_upload.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FileUpload])],
  controllers: [FileUploadController],
  providers: [FileUploadService],
})
export class FileUploadModule {}
