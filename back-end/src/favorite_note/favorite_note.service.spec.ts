import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteNoteService } from './favorite_note.service';

describe('FavoriteNoteService', () => {
  let service: FavoriteNoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FavoriteNoteService],
    }).compile();

    service = module.get<FavoriteNoteService>(FavoriteNoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
