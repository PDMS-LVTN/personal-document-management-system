import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Equal, IsNull, Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageContent } from '../image_content/entities/image_content.entity';
import { ImageContentService } from '../image_content/image_content.service';
import { User } from '../user/entities/user.entity';

require('dotenv').config();

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
    @InjectRepository(ImageContent)
    private readonly imageContentRepository: Repository<ImageContent>,
    private readonly imageContentService: ImageContentService,
    // @InjectRepository(User)
    // private readonly userRepository: Repository<User>
  ) { }

  async createNote(createNoteDto: CreateNoteDto) {
    const user = new User({ id: createNoteDto.user_id })
    const parent_note = new Note()
    parent_note.id = createNoteDto.parent_id
    const newNote = this.noteRepository.create(createNoteDto);
    // user.notes=[newNote]
    // await this.userRepository.save(user);
    newNote.parentNote = parent_note
    newNote.user = user
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
        parentNote: { id: true }
      },
      where: { user: { id: Equal(req.user_id) }, parentNote: IsNull() },
      relations: {
        parentNote: true,
        childNotes: true
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
          title: true
        },
        parentNote: { id: true }
      },
      where: { id: Equal(id) },
      relations: {
        parentNote: true,
        childNotes: true,
        headlinks: true,
        backlinks: true,
      },
    });
    // return this.noteRepository.findOneBy({ id }); //Display without relations
  }

  async searchNote(req) {
    const searchQuery = req.body.keyword;
    const notes_matching_content = await this.noteRepository
      .createQueryBuilder('note')
      .select(['id AS note_ID', 'title'])
      .where('note.user_id = :id', { id: req.body.user_id })
      .andWhere(
        `MATCH(note.content) AGAINST ('${searchQuery}' WITH QUERY EXPANSION)`,
      )
      .getRawMany();
    const notes_matching_image_content =
      await this.imageContentService.searchImageContent(req);
    return notes_matching_content.concat(notes_matching_image_content);
  }

  async updateNote(id, files, req) {
    // Method 1:
    // const note = await this.noteRepository.findOneBy({ id });
    // Object.assign(note, updateNoteDto);
    // return await this.noteRepository.save(note);
    // Method 2:

    // Upload images to upload folder and save in image_content table
    if (files.length > 0) {
      try { await this.imageContentService.uploadImage(files, req); }
      catch (err) {
        console.log(err)
        throw err
      }
      // Retrieve note's content and edit image's url (replace blob by localhost)
      req.body.content = req.body.content.replaceAll(
        'blob\\' + ':' + 'http://localhost:5173',
        process.env.IMAGE_SERVER_PATH,
      );
    }

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
