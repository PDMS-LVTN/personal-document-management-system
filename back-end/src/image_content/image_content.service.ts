import { Injectable } from '@nestjs/common';
import { CreateImageContentDto } from './dto/create-image_content.dto';
import { UpdateImageContentDto } from './dto/update-image_content.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageContent } from './entities/image_content.entity';
import { Equal, Repository } from 'typeorm';

require('dotenv').config();
const fs = require('fs');
@Injectable()
export class ImageContentService {
  constructor(
    @InjectRepository(ImageContent)
    private readonly imageContentRepository: Repository<ImageContent>,
  ) {}

  uploadImage(createImageContentDtos: CreateImageContentDto[]) {
    createImageContentDtos.map((e) => {
      const newImageContent = this.imageContentRepository.create(e);
      this.imageContentRepository.save(newImageContent);
    });
  }

  findAllImageContentMatched() {
    // return this.imageContentRepository.find({
    //   where: { user_id: Equal(req.user_id) },
    //   relations: {
    //     user: true,
    //   },
    // });
  }

  findOneImageContent(id: number) {
    return this.imageContentRepository.findOne({
      where: { id: Equal(id) },
      relations: {
        note: true,
      },
    });
  }

  async removeImageContent(path: string) {
    // Remove image file from destination folder
    fs.unlinkSync(`${process.env.UPLOAD_PATH}/${path}`);

    // Remove image_content item from database
    const image_content = await this.imageContentRepository.findOneBy({ path });
    return await this.imageContentRepository.remove(image_content);
  }
}
