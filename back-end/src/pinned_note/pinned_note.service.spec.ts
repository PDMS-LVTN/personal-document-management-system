import { Test, TestingModule } from '@nestjs/testing';
import { PinnedNoteService } from './pinned_note.service';

describe('PinnedNoteService', () => {
  let service: PinnedNoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PinnedNoteService],
    }).compile();

    service = module.get<PinnedNoteService>(PinnedNoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
