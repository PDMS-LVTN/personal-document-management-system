import { Test, TestingModule } from '@nestjs/testing';
import { ImageContentController } from './image_content.controller';
import { ImageContentService } from './image_content.service';

describe('ImageContentController', () => {
  let controller: ImageContentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageContentController],
      providers: [ImageContentService],
    }).compile();

    controller = module.get<ImageContentController>(ImageContentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
