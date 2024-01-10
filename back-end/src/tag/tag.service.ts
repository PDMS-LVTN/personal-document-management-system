import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  createTag(createTagDto: CreateTagDto) {
    const newTag = this.tagRepository.create(createTagDto);
    return this.tagRepository.save(newTag);
  }

  findAllTag(req: { user_id: string }) {
    return this.tagRepository.find({
      // where: {
      //   notes: {
      //     user_id: Equal(req.user_id),
      //   },
      // },
      relations: {
        notes: true,
      },
    });
  }

  findOneTag(id: string) {
    return this.tagRepository.findOne({
      where: { id: Equal(id) },
      relations: {
        notes: true,
      },
    });
  }

  updateTag(id: string, updateTagDto: UpdateTagDto) {
    return this.tagRepository.update(id, updateTagDto);
  }

  removeTag(id: string) {
    return this.tagRepository.delete(id);
  }
}
