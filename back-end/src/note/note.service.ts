import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Equal, Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageContent } from '../image_content/entities/image_content.entity';
import { ImageContentService } from '../image_content/image_content.service';
import { ImageContentController } from '../image_content/image_content.controller';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
    @InjectRepository(ImageContent)
    private readonly imageContentRepository: Repository<ImageContent>,
    private readonly imageContentService: ImageContentService,
  ) {}

  createNote(createNoteDto: CreateNoteDto) {
    const newNote = this.noteRepository.create(createNoteDto);
    return this.noteRepository.save(newNote);
    // await this.noteRepository.create(newNote);
  }

  findAllNote(req: { user_id: string }) {
    return this.noteRepository.find({
      where: { user_id: Equal(req.user_id) },
      relations: {
        user: true,
        parentNote: true,
        childNotes: true,
      },
    });
    // return this.noteRepository.find(); //Display without relations
  }

  async findOneNote(id: string) {
    const note = await this.noteRepository.findOne({
      where: { id: Equal(id) },
      relations: {
        user: true,
        parentNote: true,
        childNotes: true,
      },
    });
    // const image_path = await this.imageRepository.find({
    //   select: {
    //     path: true,
    //   },
    //   where: { note_ID: Equal(id) },
    // });
    // console.log(note);
    return { note };
    // return this.noteRepository.findOneBy({ id }); //Display without relations
  }

  async updateNote(id, files, req) {
    // Method 1:
    // const note = await this.noteRepository.findOneBy({ id });
    // Object.assign(note, updateNoteDto);
    // return await this.noteRepository.save(note);
    // Method 2:

    // Upload images to upload folder and save in image_content table
    this.imageContentService.uploadImage(files, req);

    // Retrieve note's content and edit image's url (replace blob by localhost)
    req.body.content = req.body.content.replaceAll(
      'blob\\' + ':' + 'http://localhost:5173',
      'http://localhost:8080',
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
