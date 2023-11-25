import { Module } from '@nestjs/common';
import { FavoriteNoteService } from './favorite_note.service';
import { FavoriteNoteController } from './favorite_note.controller';

@Module({
  controllers: [FavoriteNoteController],
  providers: [FavoriteNoteService],
})
export class FavoriteNoteModule {}
