import { ApiProperty } from '@nestjs/swagger';

export class CreateNoteDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  size: number;

  @ApiProperty()
  read_only: boolean;

  @ApiProperty()
  number_of_character: number;

  @ApiProperty()
  parent_id: string;

  @ApiProperty()
  user_id: string;
}
