import { Module } from '@nestjs/common';
import { PublicCollaboratorService } from './public_collaborator.service';
import { PublicCollaboratorController } from './public_collaborator.controller';
import { PublicCollaborator } from './entities/public_collaborator.entity';
import { Note } from '../note/entities/note.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PublicCollaborator, Note])],
  controllers: [PublicCollaboratorController],
  providers: [PublicCollaboratorService],
})
export class PublicCollaboratorModule { }
