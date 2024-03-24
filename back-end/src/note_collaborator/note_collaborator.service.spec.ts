import { Test, TestingModule } from '@nestjs/testing';
import { NoteCollaboratorService } from './note_collaborator.service';

describe('NoteCollaboratorService', () => {
  let service: NoteCollaboratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NoteCollaboratorService],
    }).compile();

    service = module.get<NoteCollaboratorService>(NoteCollaboratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
