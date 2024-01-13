import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsOptional()
  content?: string;

  @ApiProperty()
  @IsOptional()
  size: number = 0;

  @ApiProperty()
  @IsOptional()
  parent_id?: string;

  @ApiProperty()
  @IsNotEmpty()
  user_id: string;
}
