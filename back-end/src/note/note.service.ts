import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Between, Equal, In, IsNull, Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageContent } from '../image_content/entities/image_content.entity';
import { ImageContentService } from '../image_content/image_content.service';
import { User } from '../user/entities/user.entity';
import { Tag } from '../tag/entities/tag.entity';

require('dotenv').config();

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
    @InjectRepository(ImageContent)
    private readonly imageContentRepository: Repository<ImageContent>,
    private readonly imageContentService: ImageContentService,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async createNote(createNoteDto: CreateNoteDto) {
    const user = new User({ id: createNoteDto.user_id });
    const parent_note = new Note();
    parent_note.id = createNoteDto.parent_id;
    const newNote = this.noteRepository.create(createNoteDto);
    // user.notes=[newNote]
    // await this.userRepository.save(user);
    newNote.parentNote = parent_note;
    newNote.user = user;
    return await this.noteRepository.save(newNote);
  }

  async findAllNote(req: { user_id: string }) {
    return await this.noteRepository.find({
      select: {
        id: true,
        title: true,
        childNotes: {
          id: true,
          title: true,
        },
        parent_id: true,
        created_at: true,
        updated_at: true,
        // parentNote: { id: true }
      },
      where: { user: { id: Equal(req.user_id) }, parentNote: IsNull() },
      order: {
        created_at: 'ASC',
      },
      relations: {
        // user: true,
        childNotes: true,
      },
    });
    // return this.noteRepository.find(); //Display without relations
  }

  async findOneNote(id: string) {
    return await this.noteRepository.findOne({
      select: {
        id: true,
        title: true,
        content: true,
        childNotes: {
          id: true,
          title: true,
        },
        parent_id: true,
        is_favorited: true,
        is_pinned: true,
      },
      where: { id: Equal(id) },
      relations: {
        childNotes: true,
        headlinks: true,
        backlinks: true,
        tags: true,
      },
    });
    // return this.noteRepository.findOneBy({ id }); //Display without relations
  }

  async findFavoritedNote(req: { user_id: string }) {
    return await this.noteRepository.find({
      select: {
        id: true,
        title: true,
      },
      where: { user_id: Equal(req.user_id), is_favorited: true },
    });
  }

  async findPinnedNote(req: { user_id: string }) {
    return await this.noteRepository.find({
      select: {
        id: true,
        title: true,
      },
      where: { user_id: Equal(req.user_id), is_pinned: true },
    });
  }

  async filterNote(req) {
    const tagIdList = req.tags;
    const sort_key = Object.keys(req.sort_by)[0];
    const sort_value = Object.values(req.sort_by)[0];

    return await this.noteRepository.find({
      select: {
        id: true,
        title: true,
        childNotes: {
          id: true,
          title: true,
        },
        parent_id: true,
        // parentNote: { id: true }
      },
      where: {
        user: { id: Equal(req.user_id) },
        parentNote: IsNull(),
        updated_at:
          req.date_from && req.date_to
            ? Between(req.date_from, req.date_to)
            : undefined,
        tags: {
          id: tagIdList?.length > 0 ? In(tagIdList) : undefined,
        },
      },
      order: {
        created_at: sort_key === 'created_at' ? sort_value : undefined,
        updated_at: sort_key === 'updated_at' ? sort_value : undefined,
      },
      relations: {
        // parentNote: true,
        childNotes: true,
      },
    });
  }

  async searchNote(req) {
    const _ = require('lodash');
    const searchQuery = req.body.keyword;
    const notes_matching_content = await this.noteRepository
      .createQueryBuilder('note')
      .select(['id', 'title', 'created_at', 'updated_at'])
      .where('note.user_id = :id', { id: req.body.user_id })
      .andWhere(
        `MATCH(note.content) AGAINST ('"${searchQuery}"' IN BOOLEAN MODE)`,
      )
      .getRawMany();
    const notes_matching_image_content =
      await this.imageContentService.searchImageContent(req);
    console.log(searchQuery);
    console.log(notes_matching_content);
    console.log(notes_matching_image_content);
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
    const data = JSON.parse(req.body.data);
    req.body = data;

    // Upload images to upload folder and save in image_content table
    if (files.length > 0) {
      try {
        await this.imageContentService.uploadImage(files, req, id);
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
    // Retrieve note's content and edit image's url (replace blob by localhost)
    if (req.body.content) {
      req.body.content = req.body.content.replaceAll(
        ('blob\\' || 'blob') + ':' + 'http://localhost:5173',
        process.env.IMAGE_SERVER_PATH,
      );
    }
    console.log(req.body);
    // Update a note with title and content
    const updateNoteDto: UpdateNoteDto = req.body;
    return await this.noteRepository.update(id, updateNoteDto);
  }

  async removeNote(id: string) {
    // Method 1:
    // const note = await this.noteRepository.findOneBy({ id });
    // return await this.noteRepository.remove(note);
    // Method 2:
    return await this.noteRepository.delete(id);
  }

  async importNote(files, req) {
    const newNote: CreateNoteDto = {
      title: 'Untitled',
      user_id: req.user.id,
      size: 0,
    };
    const note = await this.createNote(newNote);
    await this.updateNote(note.id, files, req).catch((err) => {
      throw err;
    });
  }
}
