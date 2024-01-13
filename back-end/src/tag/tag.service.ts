import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { Note } from '../note/entities/note.entity';
import { NoteService } from '../note/note.service';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
  ) {}

  async createTag(createTagDto: CreateTagDto) {
    const tag = new Tag();
    tag.notes = [];
    if (createTagDto.note_id) {
      // tag.notes = createTagDto.notes.map((id) => ({ id })) as Note[];
      const note = await this.noteRepository.findOne({
        where: {
          id: createTagDto.note_id,
        },
      });
      tag.notes.push(note);
    }
    tag.description = createTagDto.description;
    tag.user_id = createTagDto.user_id;
    const newTag = this.tagRepository.create(tag);
    return await this.tagRepository.save(newTag);
  }

  async applyTag(id: string, updateTagDto: UpdateTagDto) {
    const tag = await this.findOneTag(id);
    const note = await this.noteRepository.findOne({
      where: {
        id: updateTagDto.note_id,
      },
    });
    tag.notes.push(note);
    return await this.tagRepository.save(tag);
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
    if (req.note_id === '') {
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
      return 'Error when removing a tag from note';
    }
  }
}
