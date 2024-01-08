import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { FilesInterceptor } from '@nestjs/platform-express';
import path = require('path');

@ApiTags('note')
@Controller('api/note/')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post('add_note')
  async createNote(@Body() createNoteDto: CreateNoteDto) {
    return await this.noteService.createNote(createNoteDto);
  }

  @Post('add_child_note')
  async createChildNote(@Body() createNoteDto: CreateNoteDto) {
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
  @UseInterceptors(
    FilesInterceptor('files[]', 20, {
      storage: diskStorage({
        destination: process.env.UPLOAD_PATH,
        filename: (req, file, cb) => {
          const fileName: string = path
            .parse(file.originalname)
            .name.replace(/\s/g, '');
          // const pos = req.body.urls[idx].lastIndexOf('/');
          // const fileName = req.body.urls[idx].substring(pos + 1) + extension;
          const extension: string = path.parse(file.originalname).ext;
          cb(null, `${fileName}${extension}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];
        allowedMimeTypes.includes(file.mimetype)
          ? cb(null, true)
          : cb(null, false);
      },
    }),
  )
  updateNote(@Param('id') id: string, @UploadedFiles() files, @Req() req) {
    return this.noteService.updateNote(id, files, req);
  }

  @Delete(':id')
  async removeNote(@Param('id') id: string) {
    return await this.noteService.removeNote(id);
  }
}
