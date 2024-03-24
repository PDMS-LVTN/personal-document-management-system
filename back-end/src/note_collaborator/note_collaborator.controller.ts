import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { NoteCollaboratorService } from "./note_collaborator.service";
import { CreateNoteCollaboratorDto } from "./dto/create-note_collaborator.dto";
import { UpdateNoteCollaboratorDto } from "./dto/update-note_collaborator.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("note_collaborator")
@Controller("api/note_collaborator/")
export class NoteCollaboratorController {
  constructor(
    private readonly noteCollaboratorService: NoteCollaboratorService
  ) {}

  @Post("add_note_collaborator")
  async createNoteCollaborator(
    @Body() createNoteCollaboratorDto: CreateNoteCollaboratorDto,
  ) {
    return await this.noteCollaboratorService.createNoteCollaborator(
      createNoteCollaboratorDto
    );
  }

  @Get("collaborators/:note_id")
  async findCollaboratorsOfNote(@Param("note_id") note_id: string) {
    return await this.noteCollaboratorService.findCollaboratorsOfNote(note_id);
  }

  @Get(":note_id")
  async findOneNoteWithEmail(
    @Param("note_id") note_id: string,
    @Body()
    req: {
      email: string;
    }
  ) {
    return await this.noteCollaboratorService.findOneNoteWithEmail(
      note_id,
      req
    );
  }

  @Delete()
  async removeNoteCollaborator(
    @Body() req: { note_id: string; email: string },
  ) {
    return this.noteCollaboratorService.removeNoteCollaborator(req);
  }
}
