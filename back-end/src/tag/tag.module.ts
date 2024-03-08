import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { Tag } from './entities/tag.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from '../note/entities/note.entity';
import { NoteModule } from '../note/note.module';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tag, Note]),
    HttpModule,
    NoteModule
  ],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule { }
