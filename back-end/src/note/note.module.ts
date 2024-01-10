import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { NoteController } from './note.controller';
import { User } from '../user/entities/user.entity';
import { ImageContent } from '../image_content/entities/image_content.entity';
import { ImageContentService } from '../image_content/image_content.service';
import { ImageContentModule } from '../image_content/image_content.module';
import { ImageContentController } from '../image_content/image_content.controller';
import { HttpModule } from '@nestjs/axios';
import { Tag } from '../tag/entities/tag.entity';
import { TagModule } from '../tag/tag.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Note, User, ImageContent, Tag]),
    ImageContentModule,
    HttpModule,
    TagModule,
  ],
  controllers: [NoteController, ImageContentController],
  providers: [NoteService, ImageContentService],
})
export class NoteModule {}
