import { PartialType } from '@nestjs/mapped-types';
import { CreateImageContentDto } from './create-image_content.dto';

export class UpdateImageContentDto extends PartialType(CreateImageContentDto) {}
