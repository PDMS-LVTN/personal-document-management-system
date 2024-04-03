import { Module } from '@nestjs/common';
import { NoteCollaboratorService } from './note_collaborator.service';
import { NoteCollaboratorController } from './note_collaborator.controller';
import { NoteCollaborator } from './entities/note_collaborator.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from '../note/entities/note.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NoteCollaborator, Note, User])],
  controllers: [NoteCollaboratorController],
  providers: [NoteCollaboratorService],
})
export class NoteCollaboratorModule { }
