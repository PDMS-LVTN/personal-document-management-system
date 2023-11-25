import { Test, TestingModule } from '@nestjs/testing';
import { RecentNoteController } from './recent_note.controller';
import { RecentNoteService } from './recent_note.service';

describe('RecentNoteController', () => {
  let controller: RecentNoteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecentNoteController],
      providers: [RecentNoteService],
    }).compile();

    controller = module.get<RecentNoteController>(RecentNoteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
