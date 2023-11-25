import { Module } from '@nestjs/common';
import { ImageContentService } from './image_content.service';
import { ImageContentController } from './image_content.controller';

@Module({
  controllers: [ImageContentController],
  providers: [ImageContentService],
})
export class ImageContentModule {}
