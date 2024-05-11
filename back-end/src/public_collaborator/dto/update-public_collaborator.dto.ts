import { PartialType } from '@nestjs/swagger';
import { CreatePublicCollaboratorDto } from './create-public_collaborator.dto';

export class UpdatePublicCollaboratorDto extends PartialType(CreatePublicCollaboratorDto) {}
