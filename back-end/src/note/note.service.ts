import { Injectable } from "@nestjs/common";
import { CreateNoteDto } from "./dto/create-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";
import {
  Between,
  Brackets,
  Equal,
  In,
  IsNull,
  Repository,
  TreeRepository,
} from "typeorm";
import { Note } from "./entities/note.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ImageContent } from "../image_content/entities/image_content.entity";
import { ImageContentService } from "../image_content/image_content.service";
import { Tag } from "../tag/entities/tag.entity";
import { FileUploadService } from "../file_upload/file_upload.service";

require("dotenv").config();

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: TreeRepository<Note>,
    @InjectRepository(ImageContent)
    private readonly imageContentRepository: Repository<ImageContent>,
    private readonly imageContentService: ImageContentService,
    private readonly uploadFileService: FileUploadService,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>
  ) {}

  async createNote(createNoteDto: CreateNoteDto) {
    // const user = new User({ id: createNoteDto.user_id });
    // const parent_note = new Note();
    // parent_note.id = createNoteDto.parent_id;
    // const newNote = this.noteRepository.create(createNoteDto);
    // // user.notes=[newNote]
    // // await this.userRepository.save(user);
    // newNote.parentNote = parent_note;
    // newNote.user = user;
    const newNote = this.noteRepository.create(createNoteDto);
    if (createNoteDto.parent_id) {
      const parent = await this.noteRepository.findOne({
        where: {
          id: createNoteDto.parent_id,
        },
      });
      newNote.parentNote = parent;
      console.log(newNote);
    }
    return await this.noteRepository.save(newNote);
  }

  async findAllNote(req: { user_id: string }) {
    const roots = (await this.noteRepository.findRoots()).filter(
      (e) => e.user_id === req.user_id
    );
    const notes = Promise.all(
      roots.map((root) => this.noteRepository.findDescendantsTree(root))
    );
    console.log(await notes);
    return await notes;
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
    const queryBuilder = await this.noteRepository.createQueryBuilder("note");
    console.log(req);

    queryBuilder.where("note.user_id = :user_id", { user_id: req.user_id });
    if (req.isFavorite)
      queryBuilder.andWhere("note.is_favorited  = :is_favorited", {
        is_favorited: req.isFavorite,
      });

    if (req.createdTimeFrom && req.createdTimeTo) {
      const currentDate = new Date(req.createdTimeTo);
      const nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() + 1);
      console.log(nextDate);
      queryBuilder.andWhere(`note.created_at BETWEEN :from AND :to`, {
        from: req.createdTimeFrom + " 00:00:00",
        to: nextDate,
      });
    }

    if (req.updatedTimeFrom && req.updatedTimeTo) {
      const currentDate = new Date(req.updatedTimeTo);
      const nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() + 1);
      console.log(nextDate);
      queryBuilder.andWhere(`note.updated_at BETWEEN :from AND :to`, {
        from: req.updatedTimeFrom + " 00:00:00",
        to: nextDate,
      });
    }

    const tagsLength = req.tags?.length;

    if (tagsLength > 0) {
      queryBuilder
        .leftJoin("note.tags", "tags")
        .andWhere(`tags.id IN (:tagId)`, {
          tagId: req.tags,
        })
        .groupBy("note.id")
        .having("COUNT(tags.id) = :count", { count: tagsLength });
    }

    if (req.sortBy) {
      req.sortBy === "CreatedNewest" &&
        queryBuilder.orderBy("note." + "created_at", "DESC");
      req.sortBy == "CreatedOldest" &&
        queryBuilder.orderBy("note." + "created_at", "ASC");
      req.sortBy == "UpdatedNewest" &&
        queryBuilder.orderBy("note." + "updated_at", "DESC");
      req.sortBy == "UpdatedOldest" &&
        queryBuilder.orderBy("note." + "updated_at", "ASC");
    }

    if (req.keyword) {
      if (req.onlyTitle) {
        queryBuilder.andWhere(
          `MATCH(note.title) AGAINST ('"${req.keyword}"' IN BOOLEAN MODE)`
        );
      } else {
        queryBuilder.leftJoin("note.image_contents", "image_content").andWhere(
          new Brackets((qb) => {
            qb.where(
              `MATCH(note.title) AGAINST ('"${req.keyword}"' IN BOOLEAN MODE)`
            )
              .orWhere(
                new Brackets((qb) => {
                  qb.where(
                    `note.content REGEXP '>([^<]*)${req.keyword}([^>]*)<'`
                  ).andWhere(
                    `MATCH(note.content) AGAINST ('"${req.keyword}"' IN BOOLEAN MODE)`
                  );
                })
              )
              .orWhere(
                `MATCH(image_content.content) AGAINST ('"${req.keyword}"' IN BOOLEAN MODE)`
              );
          })
        );
      }
    }

    return await queryBuilder
      .select("DISTINCT note.id AS id")
      .addSelect([
        "note.title AS title",
        "note.created_at AS created_at",
        "note.updated_at AS updated_at",
      ])
      .distinct(true)
      .getRawMany();
  }

  async searchNote(req) {
    const _ = require("lodash");
    const searchQuery = req.body.keyword;
    const notes_matching_content = await this.noteRepository
      .createQueryBuilder("note")
      .select(["id", "title", "created_at", "updated_at"])
      .where("note.user_id = :id", { id: req.body.user_id })
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            `MATCH(note.title) AGAINST ('"${searchQuery}"' IN BOOLEAN MODE)`
          ).orWhere(
            new Brackets((qb) => {
              qb.where(
                `note.content REGEXP '>([^<]*)${searchQuery}([^>]*)<'`
              ).andWhere(
                `MATCH(note.content) AGAINST ('"${searchQuery}"' IN BOOLEAN MODE)`
              );
            })
          );
        })
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
      "id"
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

    const image_files = [];
    const other_files = [];
    files.map((e) => {
      if (e.mimetype.includes("image")) {
        image_files.push(e);
      } else {
        other_files.push(e);
      }
    });

    // Upload images to upload folder and save in image_content table. Similar to other file uploads
    if (image_files.length > 0) {
      try {
        await this.imageContentService.uploadImage(image_files, req, id);
        // await this.imageContentService.uploadImage(other_files, req, id);
      } catch (err) {
        console.log(err);
        throw err;
      }
    }

    if (other_files.length > 0) {
      try {
        await this.uploadFileService.uploadFile(other_files, req, id);
      } catch (err) {
        console.log(err);
        throw err;
      }
    }

    // Retrieve note's content and edit image's url (replace blob by localhost)
    if (req.body.content) {
      req.body.content = req.body.content.replaceAll(
        "blob" + ":" + "http://localhost:5173",
        process.env.IMAGE_SERVER_PATH
      );
    }

    console.log(req.body);
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
    return await this.noteRepository.delete(id);
  }

  async importNote(files, req) {
    const data = JSON.parse(req.body.data);
    const newNote: CreateNoteDto = {
      title: data.title ? data.title : "Untitled",
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
    const dto = {
      ...merged_note,
      content: merged_note.content.concat(current_note.content),
      tags: merged_note.tags.concat(current_note.tags),
      image_contents: merged_note.image_contents.concat(
        current_note.image_contents
      ),
      childNotes: merged_note.childNotes.concat(current_note.childNotes),
      backlinks: merged_note.backlinks.concat(current_note.backlinks),
      headlinks: merged_note.headlinks.concat(current_note.headlinks),
      file_uploads: merged_note.file_uploads.concat(current_note.file_uploads),
    };

    await this.noteRepository.save(dto);
    await this.removeNote(id);
    return await this.findOneNote(req.merged_note_id);
  }

  async updateIsAnyone(id, is_anyone) {
    return await this.noteRepository.update(id, { is_anyone: is_anyone });
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
}
