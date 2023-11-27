import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PinnedNoteService } from './pinned_note.service';
import { CreatePinnedNoteDto } from './dto/create-pinned_note.dto';
import { UpdatePinnedNoteDto } from './dto/update-pinned_note.dto';

@Controller('pinned-note')
export class PinnedNoteController {
  constructor(private readonly pinnedNoteService: PinnedNoteService) {}

  @Post()
  create(@Body() createPinnedNoteDto: CreatePinnedNoteDto) {
    return this.pinnedNoteService.create(createPinnedNoteDto);
  }

  @Get()
  findAll() {
    return this.pinnedNoteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pinnedNoteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePinnedNoteDto: UpdatePinnedNoteDto) {
    return this.pinnedNoteService.update(+id, updatePinnedNoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pinnedNoteService.remove(+id);
  }
}
