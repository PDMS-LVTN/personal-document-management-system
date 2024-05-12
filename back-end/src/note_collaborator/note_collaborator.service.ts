import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateNoteCollaboratorDto } from './dto/create-note_collaborator.dto';
import { NoteCollaborator, ShareMode } from './entities/note_collaborator.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, IsNull, Not, Repository } from 'typeorm';
import { Note } from '../note/entities/note.entity';
import { PublicCollaborator } from '../public_collaborator/entities/public_collaborator.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class NoteCollaboratorService {
  constructor(
    @InjectRepository(NoteCollaborator)
    private readonly noteCollaboratorRepository: Repository<NoteCollaborator>,
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
    @InjectRepository(PublicCollaborator)
    private readonly publicCollaboratorRepository: Repository<PublicCollaborator>
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
    const collaborators = await this.noteCollaboratorRepository.find({
      select: {
        email: true,
        share_mode: true
      },
      where: {
        note_id: Equal(note_id),
      },
    });

    const is_anyone = await this.noteRepository.findOne({
      where: {
        id: note_id
      },
    });
    return { collaborators, is_anyone: is_anyone.is_anyone };
  }

  async findOneNoteByCollaborator(note_id, email) {
    const privateNote = await this.noteCollaboratorRepository.findOne({
      // where: [{
      //   note_id: note_id,
      //   email: email,
      // }, {
      //   note_id: note_id,
      //   note: {
      //     is_anyone: true,
      //   },
      // },],
      // relations: {
      //   note: true,
      // },
      select: {
        note: { title: true },
        share_mode: true,
        note_id: true,
        email: true
      },
      where: {
        note_id: note_id,
        email: email
      },
      relations: {
        note: true,
      }
    });
    if (privateNote) {
      return { title: privateNote.note.title, share_mode: privateNote.share_mode, note_id: privateNote.note_id, is_public: false };
    }
    const publicNote = await this.noteRepository.findOne({
      select: {
        title: true, is_anyone: true, id: true
      },
      where: {
        id: note_id,
        is_anyone: Not(IsNull())
      }
    });
    if (!publicNote) {
      throw new UnauthorizedException();
    }
    return { title: publicNote.title, share_mode: publicNote.is_anyone, note_id: publicNote.id, is_public: true };
  }

  async updateCollaboratorPermission(noteId: string, email: string, share_mode: ShareMode, date: Date) {
    await this.noteCollaboratorRepository.update({ note_id: noteId, email }, { share_mode, shared_date: date })
  }

  async getCollaboratorPermission(noteId: string, email: string) {
    const result = await this.noteCollaboratorRepository.findOne({
      select: {
        share_mode: true
      },
      where: {
        note_id: Equal(noteId),
        email: Equal(email)
      },
    });
    return result
  }

  async getAllSharedNotes(email: string) {
    const subquery = this.noteCollaboratorRepository
      .createQueryBuilder('private_notes')
      .select('private_notes.note_id', 'note_id')
      .where('private_notes.email = :email', { email });

    const public_notes = await this.publicCollaboratorRepository
      .createQueryBuilder()
      .select('public_notes.note_id', 'note_id')
      .addSelect('public_notes.email', 'email')
      .addSelect('notes.is_anyone', 'share_mode')
      .addSelect('notes.shared_date', 'shared_date')
      .addSelect('notes.title', 'title')
      .addSelect('users.email', 'owner')
      .from(PublicCollaborator, "public_notes")
      .innerJoin(Note, "notes", "public_notes.note_id = notes.id")
      .innerJoin(User, "users", "notes.user_id = users.id")
      .where('public_notes.email = :email', { email })
      .andWhere('public_notes.note_id NOT IN (' + subquery.getQuery() + ')')
      .distinct(true)
      .setParameters(subquery.getParameters())
      .getRawMany();

    const private_notes = await subquery
      .addSelect('private_notes.email', 'email')
      .addSelect('private_notes.share_mode', 'share_mode')
      .addSelect('private_notes.shared_date', 'shared_date')
      .addSelect('notes.title', 'title')
      .addSelect('notes.title', 'title')
      .addSelect('users.email', 'owner')
      .innerJoin(Note, "notes", "private_notes.note_id = notes.id")
      .innerJoin(User, "users", "notes.user_id = users.id")
      .distinct(true)
      .getRawMany()

    return { private_notes, public_notes }
  }
}
