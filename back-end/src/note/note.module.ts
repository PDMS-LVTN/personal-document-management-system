import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { NoteController } from './note.controller';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Note, User])],
  controllers: [NoteController],
  providers: [NoteService],
})
export class NoteModule {}
