import { PartialType } from '@nestjs/mapped-types';
import { CreateRecentNoteDto } from './create-recent_note.dto';

export class UpdateRecentNoteDto extends PartialType(CreateRecentNoteDto) {}
