import { PartialType } from '@nestjs/swagger';
import { CreateFileUploadDto } from './create-file_upload.dto';

export class UpdateFileUploadDto extends PartialType(CreateFileUploadDto) {}
