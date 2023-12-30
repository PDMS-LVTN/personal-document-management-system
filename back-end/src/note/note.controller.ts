import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('note')
@Controller('api/note/')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post('add_note')
  async createNote(@Body() createNoteDto: CreateNoteDto) {
    console.log(createNoteDto);
    return await this.noteService.createNote(createNoteDto);
  }

  // @UseGuards(JwtAuthGuard) //Required Authenticate
  @Post('all_note')
  findAllNote(@Body() req: { user_id: string }) {
    return this.noteService.findAllNote(req);
  }

  // @Public() //Not required for authenticate
  @Get(':id')
  findOneNote(@Param('id') id: string) {
    return this.noteService.findOneNote(id);
  }

  @Patch(':id')
  updateNote(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    return this.noteService.updateNote(id, updateNoteDto);
  }

  @Delete(':id')
  async removeNote(@Param('id') id: string) {
    return await this.noteService.removeNote(id);
  }
}
