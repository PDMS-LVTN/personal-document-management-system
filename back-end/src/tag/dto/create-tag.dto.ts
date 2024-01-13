import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTagDto {
  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsOptional()
  note_id?: string;

  @ApiProperty()
  @IsNotEmpty()
  user_id: string;
}
