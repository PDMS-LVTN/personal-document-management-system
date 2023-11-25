import { Injectable } from '@nestjs/common';
import { CreateImageContentDto } from './dto/create-image_content.dto';
import { UpdateImageContentDto } from './dto/update-image_content.dto';

@Injectable()
export class ImageContentService {
  create(createImageContentDto: CreateImageContentDto) {
    return 'This action adds a new imageContent';
  }

  findAll() {
    return `This action returns all imageContent`;
  }

  findOne(id: number) {
    return `This action returns a #${id} imageContent`;
  }

  update(id: number, updateImageContentDto: UpdateImageContentDto) {
    return `This action updates a #${id} imageContent`;
  }

  remove(id: number) {
    return `This action removes a #${id} imageContent`;
  }
}
