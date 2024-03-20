import { PartialType } from '@nestjs/mapped-types';
import { CreateImageContentDto } from './create-image_content.dto';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateImageContentDto {
  @ApiProperty()
  note_ID: string;
}
