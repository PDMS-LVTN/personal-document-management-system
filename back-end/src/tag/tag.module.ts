import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { Tag } from './entities/tag.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from '../note/entities/note.entity';
import { NoteService } from '../note/note.service';
import { NoteModule } from '../note/note.module';
import { ImageContent } from '../image_content/entities/image_content.entity';
import { ImageContentService } from '../image_content/image_content.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ImageContentModule } from '../image_content/image_content.module';
import { ImageContentController } from '../image_content/image_content.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tag, Note, ImageContent]),
    HttpModule,
    ImageContentModule,
  ],
  controllers: [TagController, ImageContentController],
  providers: [TagService, ImageContentService, NoteService],
})
export class TagModule {}
