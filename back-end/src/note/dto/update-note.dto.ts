import { PartialType } from '@nestjs/mapped-types';
import { CreateNoteDto } from './create-note.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateNoteDto {
  @ApiProperty()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsOptional()
  content?: string;

  @ApiProperty()
  @IsOptional()
  size?: number;

  @ApiProperty()
  @IsOptional()
  read_only?: boolean;

  @ApiProperty()
  @IsOptional()
  is_favorited?: boolean;

  @ApiProperty()
  @IsOptional()
  is_pinned?: boolean;

  @ApiProperty()
  @IsOptional()
  parent_id?: string;
}
