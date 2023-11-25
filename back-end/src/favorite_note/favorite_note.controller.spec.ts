import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteNoteController } from './favorite_note.controller';
import { FavoriteNoteService } from './favorite_note.service';

describe('FavoriteNoteController', () => {
  let controller: FavoriteNoteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoriteNoteController],
      providers: [FavoriteNoteService],
    }).compile();

    controller = module.get<FavoriteNoteController>(FavoriteNoteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
