import { Test, TestingModule } from '@nestjs/testing';
import { RecentNoteService } from './recent_note.service';

describe('RecentNoteService', () => {
  let service: RecentNoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecentNoteService],
    }).compile();

    service = module.get<RecentNoteService>(RecentNoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
