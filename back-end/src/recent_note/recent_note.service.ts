import { Injectable } from '@nestjs/common';
import { CreateRecentNoteDto } from './dto/create-recent_note.dto';
import { UpdateRecentNoteDto } from './dto/update-recent_note.dto';

@Injectable()
export class RecentNoteService {
  create(createRecentNoteDto: CreateRecentNoteDto) {
    return 'This action adds a new recentNote';
  }

  findAll() {
    return `This action returns all recentNote`;
  }

  findOne(id: number) {
    return `This action returns a #${id} recentNote`;
  }

  update(id: number, updateRecentNoteDto: UpdateRecentNoteDto) {
    return `This action updates a #${id} recentNote`;
  }

  remove(id: number) {
    return `This action removes a #${id} recentNote`;
  }
}
