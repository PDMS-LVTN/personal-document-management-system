import { PartialType } from '@nestjs/mapped-types';
import { CreateTagDto } from './create-tag.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTagDto {
  @ApiProperty()
  description?: string;

  @ApiProperty()
  notes?: Array<string>;
}
