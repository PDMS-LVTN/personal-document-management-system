import { PartialType } from '@nestjs/mapped-types';
import { CreateFavoriteNoteDto } from './create-favorite_note.dto';

export class UpdateFavoriteNoteDto extends PartialType(CreateFavoriteNoteDto) {}
