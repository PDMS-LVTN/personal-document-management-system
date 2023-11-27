import { Test, TestingModule } from '@nestjs/testing';
import { PinnedNoteController } from './pinned_note.controller';
import { PinnedNoteService } from './pinned_note.service';

describe('PinnedNoteController', () => {
  let controller: PinnedNoteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PinnedNoteController],
      providers: [PinnedNoteService],
    }).compile();

    controller = module.get<PinnedNoteController>(PinnedNoteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
