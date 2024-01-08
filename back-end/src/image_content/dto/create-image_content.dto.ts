import { ApiProperty } from '@nestjs/swagger';

export class CreateImageContentDto {
  @ApiProperty()
  path: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  note_ID: string;
}
