import { PartialType } from '@nestjs/mapped-types';
import { CreateNoteDto } from './create-note.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNoteDto {
  @ApiProperty()
  title?: string;

  @ApiProperty()
  content?: string;

  @ApiProperty()
  size?: number;

  @ApiProperty()
  read_only?: boolean;

  @ApiProperty()
  is_favorited?: boolean;

  @ApiProperty()
  is_pinned?: boolean;

  @ApiProperty()
  parent_id?: string;
}
