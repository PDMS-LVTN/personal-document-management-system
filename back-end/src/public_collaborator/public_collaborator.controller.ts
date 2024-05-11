import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PublicCollaboratorService } from './public_collaborator.service';
import { CreatePublicCollaboratorDto } from './dto/create-public_collaborator.dto';
import { UpdatePublicCollaboratorDto } from './dto/update-public_collaborator.dto';
import { ApiTags } from '@nestjs/swagger';

// https://stackoverflow.com/questions/71460164/error-cannot-find-module-src-entities-post

@ApiTags('public_collaborator')
@Controller('api/public_collaborator/')
export class PublicCollaboratorController {
  constructor(private readonly publicCollaboratorService: PublicCollaboratorService) { }

  @Post()
  create(@Body() createPublicCollaboratorDto: CreatePublicCollaboratorDto) {
    return this.publicCollaboratorService.create(createPublicCollaboratorDto);
  }

  @Get()
  findAll(@Query() query
    : {
      email: string;
    }) {
    return this.publicCollaboratorService.findAll(query.email);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePublicCollaboratorDto: UpdatePublicCollaboratorDto) {
    return this.publicCollaboratorService.update(+id, updatePublicCollaboratorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.publicCollaboratorService.remove(+id);
  }
}
