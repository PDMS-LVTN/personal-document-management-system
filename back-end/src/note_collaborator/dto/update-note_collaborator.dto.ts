import { PartialType } from '@nestjs/swagger';
import { CreateNoteCollaboratorDto } from './create-note_collaborator.dto';

export class UpdateNoteCollaboratorDto extends PartialType(CreateNoteCollaboratorDto) {}
