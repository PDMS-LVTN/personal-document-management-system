import { Test, TestingModule } from '@nestjs/testing';
import { PublicCollaboratorService } from './public_collaborator.service';

describe('PublicCollaboratorService', () => {
  let service: PublicCollaboratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PublicCollaboratorService],
    }).compile();

    service = module.get<PublicCollaboratorService>(PublicCollaboratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
