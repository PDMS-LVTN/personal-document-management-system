import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Equal, Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageContent } from '../image_content/entities/image_content.entity';
import { ImageContentService } from '../image_content/image_content.service';

require('dotenv').config();

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
    @InjectRepository(ImageContent)
    private readonly imageContentRepository: Repository<ImageContent>,
    private readonly imageContentService: ImageContentService,
  ) {}

  async createNote(createNoteDto: CreateNoteDto) {
    const newNote = this.noteRepository.create(createNoteDto);
    return await this.noteRepository.save(newNote);
    // await this.noteRepository.create(newNote);
  }

  async findAllNote(req: { user_id: string }) {
    return await this.noteRepository.find({
      select: {
        id: true,
        title: true,
        childNotes: {
          id: true,
        },
      },
      where: { user_id: Equal(req.user_id) },
      relations: {
        user: true,
        childNotes: true,
      },
    });
    // return this.noteRepository.find(); //Display without relations
  }

  async findOneNote(id: string) {
    return await this.noteRepository.findOne({
      where: { id: Equal(id) },
      relations: {
        backlinks: true,
      },
    });
    // return this.noteRepository.findOneBy({ id }); //Display without relations
  }

  async searchNote(req) {
    const _ = require('lodash');
    const searchQuery = req.body.keyword;
    const notes_matching_content = await this.noteRepository
      .createQueryBuilder('note')
      .select(['id', 'title'])
      .where('note.user_id = :id', { id: req.body.user_id })
      .andWhere(
        `MATCH(note.content) AGAINST ('${searchQuery}' WITH QUERY EXPANSION)`,
      )
      .getRawMany();
    const notes_matching_image_content =
      await this.imageContentService.searchImageContent(req);
    return _.unionBy(
      notes_matching_content,
      notes_matching_image_content,
      'id',
    );
  }

  async updateNote(id, files, req) {
    // Method 1:
    // const note = await this.noteRepository.findOneBy({ id });
    // Object.assign(note, updateNoteDto);
    // return await this.noteRepository.save(note);
    // Method 2:

    // Upload images to upload folder and save in image_content table
    if (files.length > 0) {
      try {
        await this.imageContentService.uploadImage(files, req);
      } catch (error) {
        return error;
      }
    }

    // Retrieve note's content and edit image's url (replace blob by localhost)
    req.body.content = req.body.content.replaceAll(
      'blob\\' + ':' + 'http://localhost:5173',
      process.env.IMAGE_SERVER_PATH,
    );

    // Update a note with title and content
    const updateNoteDto: UpdateNoteDto = {
      title: req.body.title,
      content: req.body.content,
    };
    return this.noteRepository.update(id, updateNoteDto);
  }

  async removeNote(id: string) {
    // Method 1:
    // const note = await this.noteRepository.findOneBy({ id });
    // return await this.noteRepository.remove(note);
    // Method 2:
    return await this.noteRepository.delete(id);
  }
}
