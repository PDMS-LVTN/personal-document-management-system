import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  node_ID: string;
}
