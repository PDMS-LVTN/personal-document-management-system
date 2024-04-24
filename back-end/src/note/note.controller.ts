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
  Logger,
  Query,
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
import { Public } from '../auth/auth.decorator';

@ApiTags('note')
@Controller('api/note/')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}
  private readonly logger = new Logger(NoteController.name);

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
    return await this.noteService.updateIsAnyone(id, req.is_anyone);
  }

  @Patch(':id')
  @UseInterceptors(
    FilesInterceptor(
      'files[]',
      20,
      process.env.DEBUG === '0' && {
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
      },
    ),
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
    FilesInterceptor(
      'files[]',
      20,
      process.env.DEBUG === '0' && {
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
      },
    ),
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

  @Public()
  @Get('is_anyone/:id')
  async findOneNoteForAnyone(@Param('id') id: string) {
    return await this.noteService.findOneNoteForAnyone(id);
  }

  @Post('/link_note/:id')
  async linkNote(
    @Param('id') headlink_id: string,
    @Body() req: { backlink_id: string },
  ) {
    return await this.noteService.linkNote(headlink_id, req);
  }

  @Delete('/link_note/:id')
  async removeLinkNote(
    @Param('id') headlink_id: string,
    @Body() req: { backlink_id: string },
  ) {
    return this.noteService.removeLinkNote(headlink_id, req);
  }

  @Get('/link_note/head/:id')
  async getHeadlinks(
    @Param('id') noteId: string,
    @Query() req: { name: string },
  ) {
    return await this.noteService.getHeadlinks(noteId, req.name);
  }

  @Get('/link_note/back/:id')
  async getBacklink(
    @Param('id') noteId: string,
    @Query() req: { name: string },
  ) {
    return await this.noteService.getBacklinks(noteId, req.name);
  }

  @Post('/upload/:id')
  @UseInterceptors(
    FilesInterceptor(
      'files[]',
      20,
      process.env.DEBUG === '0' && {
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
      },
    ),
  )
  async uploadAttachments(
    @Param('id') id: string,
    @UploadedFiles() files,
    @Req() req,
  ) {
    return await this.noteService
      .uploadAttachments(id, files, req, true)
      .catch((err) => {
        throw err;
      });
  }
}
