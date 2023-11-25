import { Test, TestingModule } from '@nestjs/testing';
import { ImageContentService } from './image_content.service';

describe('ImageContentService', () => {
  let service: ImageContentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageContentService],
    }).compile();

    service = module.get<ImageContentService>(ImageContentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
