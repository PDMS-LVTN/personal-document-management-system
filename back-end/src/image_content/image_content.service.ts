import { Injectable } from '@nestjs/common';
import { CreateImageContentDto } from './dto/create-image_content.dto';
import { UpdateImageContentDto } from './dto/update-image_content.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageContent } from './entities/image_content.entity';
import { Equal, Repository } from 'typeorm';

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

  update(id: string, updateImageContentDto: UpdateImageContentDto) {
    return `This action updates a #${id} imageContent`;
  }

  removeImageContent(id: number) {
    return this.imageContentRepository.delete(id);
  }
}
