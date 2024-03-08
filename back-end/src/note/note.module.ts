import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { NoteController } from './note.controller';
import { User } from '../user/entities/user.entity';
import { ImageContent } from '../image_content/entities/image_content.entity';
import { ImageContentModule } from '../image_content/image_content.module';
import { HttpModule } from '@nestjs/axios';
import { Tag } from '../tag/entities/tag.entity';
import { FileUploadModule } from '../file_upload/file_upload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Note, User, ImageContent, Tag]),
    ImageContentModule,
    FileUploadModule,
    HttpModule,
  ],
  controllers: [NoteController],
  providers: [NoteService],
  exports: [NoteService]
})
export class NoteModule { }
