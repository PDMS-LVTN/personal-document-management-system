import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RecentNoteService } from './recent_note.service';
import { CreateRecentNoteDto } from './dto/create-recent_note.dto';
import { UpdateRecentNoteDto } from './dto/update-recent_note.dto';

@Controller('recent-note')
export class RecentNoteController {
  constructor(private readonly recentNoteService: RecentNoteService) {}

  @Post()
  create(@Body() createRecentNoteDto: CreateRecentNoteDto) {
    return this.recentNoteService.create(createRecentNoteDto);
  }

  @Get()
  findAll() {
    return this.recentNoteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recentNoteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecentNoteDto: UpdateRecentNoteDto) {
    return this.recentNoteService.update(+id, updateRecentNoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recentNoteService.remove(+id);
  }
}
