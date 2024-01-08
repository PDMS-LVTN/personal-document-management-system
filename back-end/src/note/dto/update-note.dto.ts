import { PartialType } from '@nestjs/mapped-types';
import { CreateNoteDto } from './create-note.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNoteDto extends PartialType(CreateNoteDto) {
  @ApiProperty()
  title?: string;

  @ApiProperty()
  content?: string;

  @ApiProperty()
  size?: number;

  @ApiProperty()
  read_only?: boolean;

  @ApiProperty()
  parent_id?: string;
}
