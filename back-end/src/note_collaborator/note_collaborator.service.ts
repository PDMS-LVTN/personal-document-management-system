import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateNoteCollaboratorDto } from './dto/create-note_collaborator.dto';
import { UpdateNoteCollaboratorDto } from './dto/update-note_collaborator.dto';
import { NoteCollaborator } from './entities/note_collaborator.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { Note } from '../note/entities/note.entity';

@Injectable()
export class NoteCollaboratorService {
  constructor(
    @InjectRepository(NoteCollaborator)
    private readonly noteCollaboratorRepository: Repository<NoteCollaborator>,
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>
  ) { }

  async createNoteCollaborator(
    createNoteCollaboratorDto: CreateNoteCollaboratorDto,
  ) {
    const newNoteCollaborator = this.noteCollaboratorRepository.create(
      createNoteCollaboratorDto,
    );
    return await this.noteCollaboratorRepository.save(newNoteCollaborator);
  }

  async removeNoteCollaborator(req) {
    return await this.noteCollaboratorRepository.delete({
      note_id: req.note_id,
      email: req.email,
    });
  }

  async findCollaboratorsOfNote(note_id) {
    const emails = await this.noteCollaboratorRepository.find({
      select: {
        email: true,
      },
      where: {
        note_id: Equal(note_id),
      },
    });

    const is_anyone = await this.noteRepository.findOne({
      select: {
        is_anyone: true,
      },
      where: {
        id: Equal(note_id),
      },
    });
    const retEmails = emails.map((email) => email.email);
    return { emails: retEmails, is_anyone: is_anyone.is_anyone };
  }

  async findOneNoteByCollaborator(note_id, email) {
    const note = await this.noteCollaboratorRepository.findOne({
      where: [{
        note_id: note_id,
        email: email,
      }, {
        note_id: note_id,
        note: {
          is_anyone: true,
        },
      },],
      relations: {
        note: true,
      },
    });
    if (!note) {
      throw new UnauthorizedException();
    }
    return note.note;
  }
}
