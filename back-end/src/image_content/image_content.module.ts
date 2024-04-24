import { Module } from '@nestjs/common';
import { ImageContentService } from './image_content.service';
import { ImageContentController } from './image_content.controller';
import { ImageContent } from './entities/image_content.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([ImageContent]), HttpModule],
  controllers: [ImageContentController],
  providers: [ImageContentService, ConfigService],
  exports: [ImageContentService],
})
export class ImageContentModule {}
