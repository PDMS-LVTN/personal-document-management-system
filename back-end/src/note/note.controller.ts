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
import { ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import path = require('path');

@ApiTags('note')
@Controller('api/note/')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post('add_note')
  async createNote(@Body() createNoteDto: CreateNoteDto) {
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

  @Post('favorited_note')
  findFavoritedNote(@Body() req: { user_id: string }) {
    return this.noteService.findFavoritedNote(req);
  }

  @Post('pinned_note')
  findPinnedNote(@Body() req: { user_id: string }) {
    return this.noteService.findPinnedNote(req);
  }

  @Post('filter')
  filterNote(
    @Body()
    req: {
      user_id: string;
      keyword: string;
      onlyTitle: Boolean;
      sortBy?: string;
      tags?: Array<string>;
      createdTimeFrom?: Date;
      createdTimeTo?: Date;
      updatedTimeFrom?: Date;
      updatedTimeTo?: Date;
      isFavorite: Boolean;
    },
  ) {
    return this.noteService.filterNote(req);
  }

  @Post('search')
  searchNote(@Req() req: { user_id: string; keyword: string }) {
    return this.noteService.searchNote(req);
  }

  @Patch('move_note')
  async moveNote(
    @Body()
    req: {
      note_id_list: Array<string>;
      parent_id: string;
      user_id: string;
    },
  ) {
    return await this.noteService.moveNote(req);
  }

  @Patch('is_anyone/:id')
  async updateIsAnyone(
    @Param('id') id: string,
    @Body() req: { is_anyone: boolean },
  ) {
    return await this.noteService.updateIsAnyone(id, req);
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
          const extension: string = path.parse(file.originalname).ext;
          cb(null, `${fileName}${extension}`);
        },
      }),
    }),
    // FileFieldsInterceptor([
    //   { name: 'images', maxCount: 20 },
    //   { name: 'others', maxCount: 20 },
    // ],)
  )
  async updateNote(
    @Param('id') id: string,
    @UploadedFiles() files,
    @Req() req,
  ) {
    return await this.noteService.updateNote(id, files, req).catch((err) => {
      throw err;
    });
  }

  @Delete(':id')
  async removeNote(@Param('id') id: string) {
    return await this.noteService.removeNote(id);
  }

  @Post('import')
  @UseInterceptors(
    FilesInterceptor('files[]', 20, {
      storage: diskStorage({
        destination: process.env.UPLOAD_PATH,
        filename: (req, file, cb) => {
          const fileName: string = path
            .parse(file.originalname)
            .name.replace(/\s/g, '');
          const extension: string = path.parse(file.originalname).ext;
          cb(null, `${fileName}${extension}`);
        },
      }),
    }),
  )
  async importNote(@UploadedFiles() files, @Req() req) {
    return await this.noteService.importNote(files, req);
  }

  @Patch('merge_note/:id')
  async mergeNote(
    @Param('id') id: string,
    @Body() req: { merged_note_id: string },
  ) {
    return await this.noteService.mergeNote(id, req);
  }

  @Get('attachments/:id')
  async findAttachmentsOfNote(@Param('id') id: string) {
    return await this.noteService.findAttachmentsOfNote(id);
  }
}
