import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty()
  description: string;

  @ApiProperty()
  note_id?: string;

  @ApiProperty()
  user_id?: string;
}
