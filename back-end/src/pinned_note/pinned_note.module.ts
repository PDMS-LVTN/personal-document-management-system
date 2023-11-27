import { Module } from '@nestjs/common';
import { PinnedNoteService } from './pinned_note.service';
import { PinnedNoteController } from './pinned_note.controller';

@Module({
  controllers: [PinnedNoteController],
  providers: [PinnedNoteService],
})
export class PinnedNoteModule {}
