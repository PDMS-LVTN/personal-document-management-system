import { PartialType } from '@nestjs/mapped-types';
import { CreatePinnedNoteDto } from './create-pinned_note.dto';

export class UpdatePinnedNoteDto extends PartialType(CreatePinnedNoteDto) {}
