import { ApiProperty } from '@nestjs/swagger';

export class CreateNoteDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  size: number = 0;

  @ApiProperty()
  read_only: boolean;

  @ApiProperty()
  parent_id: string;

  @ApiProperty()
  user_id: string;
}
