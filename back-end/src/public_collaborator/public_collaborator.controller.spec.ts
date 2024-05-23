import { Test, TestingModule } from '@nestjs/testing';
import { PublicCollaboratorController } from './public_collaborator.controller';
import { PublicCollaboratorService } from './public_collaborator.service';

describe('PublicCollaboratorController', () => {
  let controller: PublicCollaboratorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicCollaboratorController],
      providers: [PublicCollaboratorService],
    }).compile();

    controller = module.get<PublicCollaboratorController>(PublicCollaboratorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
