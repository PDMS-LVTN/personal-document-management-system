import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import {
  // Between,
  Brackets,
  Equal,
  // In,
  IsNull,
  Not,
  // Repository,
  TreeRepository,
} from 'typeorm';
import { Note } from './entities/note.entity';
import { InjectRepository } from '@nestjs/typeorm';
// import { ImageContent } from '../image_content/entities/image_content.entity';
import { ImageContentService } from '../image_content/image_content.service';
// import { Tag } from '../tag/entities/tag.entity';
import { FileUploadService } from '../file_upload/file_upload.service';
import { TiptapTransformer } from '@hocuspocus/transformer';
import * as Y from 'yjs';
import { ShareMode } from 'src/note_collaborator/entities/note_collaborator.entity';

require('dotenv').config();

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: TreeRepository<Note>,
    // @InjectRepository(ImageContent)
    // private readonly imageContentRepository: Repository<ImageContent>,
    private readonly imageContentService: ImageContentService,
    private readonly uploadFileService: FileUploadService,
  ) {}
  private readonly logger = new Logger(NoteService.name);

  async createNote(createNoteDto: CreateNoteDto) {
    const newNote = this.noteRepository.create(createNoteDto);
    if (createNoteDto.parent_id) {
      const parent = await this.noteRepository.findOne({
        where: {
          id: createNoteDto.parent_id,
        },
      });
      newNote.parentNote = parent;
    }
    return await this.noteRepository.save(newNote);
  }

  async findAllNote(req: { user_id: string }) {
    const roots = (await this.noteRepository.findRoots()).filter(
      (e) => e.user_id === req.user_id,
    );
    const notes = Promise.all(
      roots.map((root) => this.noteRepository.findDescendantsTree(root)),
    );
    // console.log(await notes);
    return await notes;
    // return this.noteRepository.find(); //Display without relations
  }

  async getParentPath(id: string) {
    let note = await this.noteRepository.findOne({
      where: {
        id: Equal(id),
      },
      relations: {
        parentNote: true,
      },
    });
    let path = [];
    while (note && note.parentNote) {
      note = await this.noteRepository.findOne({
        where: {
          id: Equal(note.parent_id),
        },
        relations: {
          parentNote: true,
          childNotes: true,
        },
      });
      path.push({
        id: note.id,
        title: note.title,
        childNotes: note.childNotes,
      });
    }
    return path.reverse();
  }

  async findOneNote(id: string) {
    const parentPath = await this.getParentPath(id);
    const note = await this.noteRepository.findOne({
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
    return {
      ...note,
      parentPath,
    };
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
    const queryBuilder = await this.noteRepository.createQueryBuilder('note');
    console.log(req);

    queryBuilder.where('note.user_id = :user_id', { user_id: req.user_id });
    if (req.isFavorite)
      queryBuilder.andWhere('note.is_favorited  = :is_favorited', {
        is_favorited: req.isFavorite,
      });

    if (req.createdTimeFrom && req.createdTimeTo) {
      const currentDate = new Date(req.createdTimeTo);
      const nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() + 1);
      console.log(nextDate);
      queryBuilder.andWhere(`note.created_at BETWEEN :from AND :to`, {
        from: req.createdTimeFrom + ' 00:00:00',
        to: nextDate,
      });
    }

    if (req.updatedTimeFrom && req.updatedTimeTo) {
      const currentDate = new Date(req.updatedTimeTo);
      const nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() + 1);
      console.log(nextDate);
      queryBuilder.andWhere(`note.updated_at BETWEEN :from AND :to`, {
        from: req.updatedTimeFrom + ' 00:00:00',
        to: nextDate,
      });
    }

    const tagsLength = req.tags?.length;

    if (tagsLength > 0) {
      queryBuilder
        .leftJoin('note.tags', 'tags')
        .andWhere(`tags.id IN (:tagId)`, {
          tagId: req.tags,
        })
        .groupBy('note.id')
        .having('COUNT(tags.id) = :count', { count: tagsLength });
    }

    if (req.sortBy) {
      req.sortBy === 'CreatedNewest' &&
        queryBuilder.orderBy('note.' + 'created_at', 'DESC');
      req.sortBy == 'CreatedOldest' &&
        queryBuilder.orderBy('note.' + 'created_at', 'ASC');
      req.sortBy == 'UpdatedNewest' &&
        queryBuilder.orderBy('note.' + 'updated_at', 'DESC');
      req.sortBy == 'UpdatedOldest' &&
        queryBuilder.orderBy('note.' + 'updated_at', 'ASC');
    }

    if (req.keyword) {
      if (req.onlyTitle) {
        queryBuilder.andWhere(
          `MATCH(note.title) AGAINST ('${req.keyword}*' IN BOOLEAN MODE)`,
        );
      } else {
        const others_filter = await queryBuilder
          .select('DISTINCT note.id AS id')
          .addSelect([
            'note.title AS title',
            'note.created_at AS created_at',
            'note.updated_at AS updated_at',
          ])
          .distinct(true)
          .getRawMany();
        const keyword_filter = await this.searchNote({
          body: { keyword: req.keyword, user_id: req.user_id },
        });
        const _ = require('lodash');
        return _.intersectionBy(keyword_filter, others_filter, 'id');
      }
    }
    return await queryBuilder
      .select('DISTINCT note.id AS id')
      .addSelect([
        'note.title AS title',
        'note.created_at AS created_at',
        'note.updated_at AS updated_at',
      ])
      .distinct(true)
      .getRawMany();
  }

  async searchNote(req) {
    const _ = require('lodash');
    const searchQuery = req.body.keyword;
    const notes_matching_content = await this.noteRepository
      .createQueryBuilder('note')
      .select(['id', 'title', 'created_at', 'updated_at'])
      .where('note.user_id = :id', { id: req.body.user_id })
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            `MATCH(note.title) AGAINST ('${searchQuery}*' IN BOOLEAN MODE)`,
          ).orWhere(
            `MATCH(note.content) AGAINST ('${searchQuery}*' IN BOOLEAN MODE)`,
          );
        }),
      )
      .limit(5)
      .getRawMany();
    const notes_matching_image_content =
      await this.imageContentService.searchImageContent(req);
    console.log(searchQuery);
    console.log(notes_matching_content);
    console.log(notes_matching_image_content);
    return _.unionBy(
      notes_matching_image_content,
      notes_matching_content,
      'id',
    );
  }

  async updateNote(id: string, files, req) {
    // Method 1:
    // const note = await this.noteRepository.findOneBy({ id });
    // Object.assign(note, updateNoteDto);
    // return await this.noteRepository.save(note);
    // Method 2:
    const data = JSON.parse(req.body.data);
    req.body = data;

    // const image_files = [];
    // const other_files = [];
    // files.map((e) => {
    //   if (e.mimetype.includes('image')) {
    //     image_files.push(e);
    //   } else {
    //     other_files.push(e);
    //   }
    // });

    // // Upload images to upload folder and save in image_content table. Similar to other file uploads
    // if (image_files.length > 0) {
    //   try {
    //     await this.imageContentService.uploadImage(image_files, req, id);
    //     // await this.imageContentService.uploadImage(other_files, req, id);
    //   } catch (err) {
    //     console.log(err);
    //     throw err;
    //   }
    // }

    // if (other_files.length > 0) {
    //   try {
    //     await this.uploadFileService.uploadFile(other_files, req, id);
    //   } catch (err) {
    //     console.log(err);
    //     throw err;
    //   }
    // }
    this.uploadAttachments(id, files, req);
    // Retrieve note's content and edit image's url (replace blob by localhost)
    if (req.body.content) {
      req.body.content = req.body.content.replaceAll(
        'blob' + ':' + process.env.CLIENT_URL,
        process.env.IMAGE_SERVER_PATH,
      );
    }

    // console.log(req.body);
    // Update a note with title and content
    const updateNoteDto: UpdateNoteDto = req.body;
    await this.noteRepository.update(id, updateNoteDto);
    return await this.findOneNote(id);
  }

  async removeNote(id: string) {
    // Method 1:
    // const note = await this.noteRepository.findOneBy({ id });
    // return await this.noteRepository.remove(note);
    // Method 2:
    const images = await this.imageContentService
      .findImagesOfNote({ note_ID: id })
      .catch((err) => {
        throw err;
      });
    const files = await this.uploadFileService
      .findFilesOfNote({ note_ID: id })
      .catch((err) => {
        throw err;
      });
    images.map(async (image) => {
      await this.imageContentService
        .removeImageContent(image.path)
        .catch((err) => {
          throw err;
        });
    });
    files.map(async (file) => {
      await this.uploadFileService.removeFileUpload(file.path).catch((err) => {
        throw err;
      });
    });
    return await this.noteRepository.delete(id);
  }

  async importNote(files, req) {
    const data = JSON.parse(req.body.data);
    // this.logger.debug(data)
    const newNote: CreateNoteDto = {
      title: data.title ? data.title : 'Untitled',
      user_id: data.user_id,
      size: 0,
      parent_id: data.parent_id,
    };
    const note = await this.createNote(newNote);
    await this.updateNote(note.id, files, req).catch((err) => {
      throw err;
    });
    return await this.findOneNote(note.id);
  }

  async moveNote(req) {
    let parentNote = null;
    if (req.parent_id) {
      parentNote = await this.noteRepository.findOne({
        where: {
          id: Equal(req.parent_id),
        },
      });
    }
    req.note_id_list.map(async (id) => {
      const currentNote = await this.findOneNote(id);
      currentNote.parentNote = parentNote;
      await this.noteRepository.save(currentNote);
    });
    return await this.findAllNote({ user_id: req.user_id });
  }

  async mergeNote(id, req) {
    const merged_note = await this.noteRepository.findOne({
      where: {
        id: Equal(req.merged_note_id),
      },
      relations: {
        tags: true,
        image_contents: true,
        childNotes: true,
        backlinks: true,
        headlinks: true,
        file_uploads: true,
      },
    });
    const current_note = await this.noteRepository.findOne({
      where: {
        id: Equal(id),
      },
      relations: {
        tags: true,
        image_contents: true,
        childNotes: true,
        backlinks: true,
        headlinks: true,
        file_uploads: true,
      },
    });

    const ydoc = new Y.Doc();
    Y.applyUpdate(ydoc, merged_note.binary_update_data);
    Y.applyUpdate(ydoc, current_note.binary_update_data);

    const dto = {
      ...merged_note,
      content: merged_note.content.concat(current_note.content),
      tags: merged_note.tags.concat(current_note.tags),
      image_contents: merged_note.image_contents.concat(
        current_note.image_contents,
      ),
      childNotes: merged_note.childNotes.concat(current_note.childNotes),
      backlinks: merged_note.backlinks.concat(current_note.backlinks),
      headlinks: merged_note.headlinks.concat(current_note.headlinks),
      file_uploads: merged_note.file_uploads.concat(current_note.file_uploads),
      binary_update_data: Buffer.from(Y.encodeStateAsUpdate(ydoc)),
    };

    await this.noteRepository.save(dto);
    await this.removeNote(id);
    return await this.findOneNote(req.merged_note_id);
  }

  async updateIsAnyone(id: string, is_anyone: ShareMode, date: Date) {
    return await this.noteRepository.update(id, {
      is_anyone,
      shared_date: date,
    });
  }

  async findAttachmentsOfNote(id: string) {
    const images = await this.imageContentService
      .findImagesOfNote({ note_ID: id })
      .catch((err) => {
        throw err;
      });
    const files = await this.uploadFileService
      .findFilesOfNote({ note_ID: id })
      .catch((err) => {
        throw err;
      });
    return {
      images: images,
      files: files,
    };
  }

  async findOneNoteForAnyone(id: string) {
    const note = await this.noteRepository.findOne({
      select: {
        id: true,
        title: true,
        is_anyone: true,
        // content: true,
        // childNotes: {
        //   id: true,
        //   title: true,
        // },
        // parent_id: true,
        // is_favorited: true,
        // is_pinned: true,
      },
      where: {
        id: Equal(id),
        is_anyone: Not(IsNull()),
      },
      // },
      // relations: {
      //   childNotes: true,
      //   headlinks: true,
      //   backlinks: true,
      //   tags: true,
      // },
    });
    if (!note) {
      throw new UnauthorizedException();
    }
    return { title: note.title, share_mode: note.is_anyone, note_id: note.id };
  }

  async linkNote(headlink_id: string, req) {
    const headlink_note = await this.findOneNote(headlink_id);
    const backlink_note = await this.findOneNote(req.backlink_id);
    headlink_note.backlinks.push(backlink_note);
    return await this.noteRepository.save(headlink_note);
  }

  async removeLinkNote(headlink_id: string, req) {
    const headlink_note = await this.findOneNote(headlink_id);
    headlink_note.backlinks = headlink_note.backlinks.filter(
      (backlink_note) => {
        return backlink_note.id !== req.backlink_id;
      },
    );
    try {
      return await this.noteRepository.save(headlink_note);
    } catch (e) {
      return 'Error when removing a note link from a note';
    }
  }

  async getHeadlinks(noteId: string, name: string) {
    const note = await this.noteRepository.findOne({
      where: {
        id: Equal(noteId),
      },
      relations: {
        headlinks: true,
      },
    });
    const maxLength = 50;
    const mappedResults = note.headlinks.map((linkedNote, _) => {
      const strippedContent = this.stripHTML(linkedNote.content);
      const subContent = strippedContent.substring(0, maxLength);
      const content =
        subContent.length < strippedContent.length
          ? subContent + '...'
          : subContent;
      return { ...linkedNote, content: [{ content, index: 0 }] };
    });
    return mappedResults;
  }

  async getBacklinks(noteId: string, name: string) {
    const note = await this.noteRepository.findOne({
      where: {
        id: Equal(noteId),
      },
      relations: {
        backlinks: true,
      },
    });
    const mappedResults = note.backlinks.map((linkedNote, _) => {
      const strippedContent = this.stripHTML(linkedNote.content);
      const content = this.createSearchTermContext(strippedContent, name);
      return { ...linkedNote, content };
    });
    return mappedResults;
  }

  stripHTML(content: string) {
    return content.replace(/<[^>]*>/g, ' ');
  }

  createSearchTermContext(content: string, term: string) {
    const max_length = 400; // Max length in characters
    const min_padding = 30; // Min length in characters of the context to place around found search terms

    // Search content for terms
    const regexPattern = new RegExp(term, 'gi');
    const matches = content.match(regexPattern);
    let output = [];
    let index = 0;
    if (matches) {
      const padding = Math.max(
        min_padding,
        Math.floor(max_length / (2 * matches.length)),
      );

      // Construct extract containing context for each term
      let last_offset = 0;
      for (const match of matches) {
        const offset = content.indexOf(match, last_offset);
        let start = offset - padding;
        let end = offset + match.length + padding;

        while (start > 1 && content[start - 1].match(/[A-Za-z0-9'"-]/)) {
          start--;
        }

        while (
          end < content.length - 1 &&
          content[end].match(/[A-Za-z0-9'"-]/)
        ) {
          end++;
        }

        start = Math.max(start, 0);
        let context = content.substring(start, end);
        context = context.replaceAll(
          term,
          `<span class="reference-term"">${term}</span>`,
        );

        if (start > 0) {
          context = '...' + context;
        }

        // output += context;
        last_offset = offset + match.length;
        if (end < content.length - 1) {
          context += '...';
        }
        output.push({ content: context, index });
        index++;
      }

      // if (last_offset !== content.length - 1) {
      //   output += '...';
      // }
    } else {
      output = [{ content: content.substring(0, max_length) + '...', index }];
    }

    // if (output.length > max_length) {
    //   let end = max_length - 3;
    //   while (end > 1 && output[end - 1].match(/[A-Za-z0-9'"-]/)) {
    //     end--;
    //   }
    //   output = output.substring(0, end) + '...';
    // }
    return output;
  }

  async uploadAttachments(id: string, files, req, direct = false) {
    console.log(files);
    const image_files = [];
    const other_files = [];
    let urls = [];
    files.map((e) => {
      if (e.mimetype.includes('image')) {
        image_files.push(e);
      } else {
        other_files.push(e);
      }
    });

    // Upload images to upload folder and save in image_content table. Similar to other file uploads
    if (image_files.length > 0) {
      try {
        urls = await this.imageContentService.uploadImage(
          image_files,
          req,
          id,
          direct,
        );
        // await this.imageContentService.uploadImage(other_files, req, id);
      } catch (err) {
        console.log(err);
        throw err;
      }
    }

    if (other_files.length > 0) {
      try {
        urls = await this.uploadFileService.uploadFile(
          other_files,
          req,
          id,
          direct,
        );
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
    return urls;
  }
}
