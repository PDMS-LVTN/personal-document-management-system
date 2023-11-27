import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FavoriteNoteService } from './favorite_note.service';
import { CreateFavoriteNoteDto } from './dto/create-favorite_note.dto';
import { UpdateFavoriteNoteDto } from './dto/update-favorite_note.dto';

@Controller('favorite-note')
export class FavoriteNoteController {
  constructor(private readonly favoriteNoteService: FavoriteNoteService) {}

  @Post()
  create(@Body() createFavoriteNoteDto: CreateFavoriteNoteDto) {
    return this.favoriteNoteService.create(createFavoriteNoteDto);
  }

  @Get()
  findAll() {
    return this.favoriteNoteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.favoriteNoteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFavoriteNoteDto: UpdateFavoriteNoteDto) {
    return this.favoriteNoteService.update(+id, updateFavoriteNoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.favoriteNoteService.remove(+id);
  }
}
