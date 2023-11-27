import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
  ) {}

  createNote(createNoteDto: CreateNoteDto) {
    const newNote = this.noteRepository.create(createNoteDto);
    return this.noteRepository.save(newNote);
    // await this.noteRepository.create(newNote);
  }

  findAllNote(req: { user_id: string }) {
    return this.noteRepository.find({
      where: { user_id: req.user_id },
      relations: {
        user: true,
        parentNote: true,
        childNotes: true,
      },
    });
    // return this.noteRepository.find(); //Display without relations
  }

  async findOneNote(id: string) {
    return this.noteRepository.findOne({
      where: { id },
      relations: {
        user: true,
        parentNote: true,
        childNotes: true,
      },
    });
    // return this.noteRepository.findOneBy({ id }); //Display without relations
  }

  async updateNote(id: string, updateNoteDto: UpdateNoteDto) {
    // Method 1:
    // const note = await this.noteRepository.findOneBy({ id });
    // Object.assign(note, updateNoteDto);
    // return await this.noteRepository.save(note);
    // Method 2:
    return this.noteRepository.update(id, updateNoteDto);
  }

  async removeNote(id: string) {
    // Method 1:
    // const note = await this.noteRepository.findOneBy({ id });
    // return await this.noteRepository.remove(note);
    // Method 2:
    return await this.noteRepository.delete(id);
  }
}
