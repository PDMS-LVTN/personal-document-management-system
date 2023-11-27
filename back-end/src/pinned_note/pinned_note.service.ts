import { Injectable } from '@nestjs/common';
import { CreatePinnedNoteDto } from './dto/create-pinned_note.dto';
import { UpdatePinnedNoteDto } from './dto/update-pinned_note.dto';

@Injectable()
export class PinnedNoteService {
  create(createPinnedNoteDto: CreatePinnedNoteDto) {
    return 'This action adds a new pinnedNote';
  }

  findAll() {
    return `This action returns all pinnedNote`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pinnedNote`;
  }

  update(id: number, updatePinnedNoteDto: UpdatePinnedNoteDto) {
    return `This action updates a #${id} pinnedNote`;
  }

  remove(id: number) {
    return `This action removes a #${id} pinnedNote`;
  }
}
