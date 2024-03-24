import { Test, TestingModule } from '@nestjs/testing';
import { NoteCollaboratorController } from './note_collaborator.controller';
import { NoteCollaboratorService } from './note_collaborator.service';

describe('NoteCollaboratorController', () => {
  let controller: NoteCollaboratorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoteCollaboratorController],
      providers: [NoteCollaboratorService],
    }).compile();

    controller = module.get<NoteCollaboratorController>(NoteCollaboratorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
