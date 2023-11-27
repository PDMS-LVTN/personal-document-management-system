import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ImageContentService } from './image_content.service';
import { CreateImageContentDto } from './dto/create-image_content.dto';
import { UpdateImageContentDto } from './dto/update-image_content.dto';

@Controller('image-content')
export class ImageContentController {
  constructor(private readonly imageContentService: ImageContentService) {}

  @Post()
  create(@Body() createImageContentDto: CreateImageContentDto) {
    return this.imageContentService.create(createImageContentDto);
  }

  @Get()
  findAll() {
    return this.imageContentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imageContentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImageContentDto: UpdateImageContentDto) {
    return this.imageContentService.update(+id, updateImageContentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imageContentService.remove(+id);
  }
}
