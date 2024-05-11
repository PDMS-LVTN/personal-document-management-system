import { Injectable } from '@nestjs/common';
import { CreatePublicCollaboratorDto } from './dto/create-public_collaborator.dto';
import { UpdatePublicCollaboratorDto } from './dto/update-public_collaborator.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PublicCollaborator } from './entities/public_collaborator.entity';
import { Repository } from 'typeorm';
import { Note } from '../note/entities/note.entity';

@Injectable()
export class PublicCollaboratorService {
  constructor(
    @InjectRepository(PublicCollaborator)
    private readonly noteCollaboratorRepository: Repository<PublicCollaborator>,
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>
  ) { }

  async create(createPublicCollaboratorDto: CreatePublicCollaboratorDto) {
    const newNoteCollaborator = this.noteCollaboratorRepository.create(
      createPublicCollaboratorDto,
    );
    return await this.noteCollaboratorRepository.save(newNoteCollaborator);
  }

  findAll(email: string) {
    return `This action returns all publicCollaborator`;
  }

  findOne(id: number) {
    return `This action returns a #${id} publicCollaborator`;
  }

  update(id: number, updatePublicCollaboratorDto: UpdatePublicCollaboratorDto) {
    return `This action updates a #${id} publicCollaborator`;
  }

  remove(id: number) {
    return `This action removes a #${id} publicCollaborator`;
  }
}
