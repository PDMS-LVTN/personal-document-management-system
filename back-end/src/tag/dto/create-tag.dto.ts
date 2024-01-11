import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty()
  description: string;

  @ApiProperty()
  notes?: Array<string>;

  @ApiProperty()
  user_id: string;
}
