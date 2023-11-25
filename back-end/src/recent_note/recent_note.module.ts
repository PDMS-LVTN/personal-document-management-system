import { Module } from '@nestjs/common';
import { RecentNoteService } from './recent_note.service';
import { RecentNoteController } from './recent_note.controller';

@Module({
  controllers: [RecentNoteController],
  providers: [RecentNoteService],
})
export class RecentNoteModule {}
