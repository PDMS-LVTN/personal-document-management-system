import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { Note } from '../note/entities/note.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) { }

  async createTag(createTagDto: CreateTagDto) {
    const tag = new Tag();
    if (createTagDto.notes.length > 0) {
      tag.notes = createTagDto.notes.map((id) => ({ id })) as Note[];
    }
    tag.description = createTagDto.description;
    tag.user_id = createTagDto.user_id;
    const newTag = this.tagRepository.create(tag);
    return await this.tagRepository.save(newTag);
  }

  async findAllTag(req: { user_id: string }) {
    return await this.tagRepository.find({
      where: {
        user_id: Equal(req.user_id),
      },
    });
  }

  async findOneTag(id: string) {
    return await this.tagRepository.findOne({
      where: { id: Equal(id) },
      relations: {
        notes: true,
      },
    });
  }

  async removeTag(id: string, req) {
    if (!req.note_id) {
      return await this.tagRepository.delete(id);
    }
    const tag = await this.tagRepository.findOne({
      relations: {
        notes: true,
      },
      where: { id: Equal(id) },
    });
    tag.notes = tag.notes.filter((note) => {
      return note.id !== req.note_id;
    });
    try {
      await this.tagRepository.save(tag);
    } catch (e) {
      return 'Error when remove a tag from note';
    }
  }
}
