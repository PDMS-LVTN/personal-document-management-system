import { Injectable } from '@nestjs/common';
import { CreateFavoriteNoteDto } from './dto/create-favorite_note.dto';
import { UpdateFavoriteNoteDto } from './dto/update-favorite_note.dto';

@Injectable()
export class FavoriteNoteService {
  create(createFavoriteNoteDto: CreateFavoriteNoteDto) {
    return 'This action adds a new favoriteNote';
  }

  findAll() {
    return `This action returns all favoriteNote`;
  }

  findOne(id: number) {
    return `This action returns a #${id} favoriteNote`;
  }

  update(id: number, updateFavoriteNoteDto: UpdateFavoriteNoteDto) {
    return `This action updates a #${id} favoriteNote`;
  }

  remove(id: number) {
    return `This action removes a #${id} favoriteNote`;
  }
}
