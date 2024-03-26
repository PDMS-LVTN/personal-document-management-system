import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  Query
} from "@nestjs/common";
import { NoteCollaboratorService } from "./note_collaborator.service";
import { CreateNoteCollaboratorDto } from "./dto/create-note_collaborator.dto";
import { UpdateNoteCollaboratorDto } from "./dto/update-note_collaborator.dto";
import { ApiTags } from "@nestjs/swagger";
import { Public } from '../auth/auth.decorator'

@ApiTags('note_collaborator')
@Controller('api/note_collaborator/')
export class NoteCollaboratorController {
  constructor(
    private readonly noteCollaboratorService: NoteCollaboratorService,
  ) { }
  // private readonly logger = new Logger(NoteCollaboratorController.name);

  @Post('add_note_collaborator')
  async createNoteCollaborator(
    @Body() createNoteCollaboratorDto: CreateNoteCollaboratorDto,
  ) {
    return await this.noteCollaboratorService.createNoteCollaborator(
      createNoteCollaboratorDto,
    );
  }

  @Get('collaborators/:note_id')
  async findCollaboratorsOfNote(@Param('note_id') note_id: string) {
    return await this.noteCollaboratorService.findCollaboratorsOfNote(note_id);
  }

  @Get(":note_id")
  async findOneNoteWithEmail(
    @Param("note_id") note_id: string,
    @Query() query
      : {
        email: string;
      }
  ) {
    return await this.noteCollaboratorService.findOneNoteByCollaborator(
      note_id,
      query.email
    );
  }

  @Delete()
  async removeNoteCollaborator(
    @Body() req: { note_id: string; email: string },
  ) {
    return this.noteCollaboratorService.removeNoteCollaborator(req);
  }
}
