import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('tag')
@Controller('api/tag/')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post('create_tag')
  createTag(@Body() createTagDto: CreateTagDto) {
    return this.tagService.createTag(createTagDto);
  }

  @Post('apply_tag/:id')
  applyTag(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagService.applyTag(id, updateTagDto);
  }

  @Post('all_tag')
  findAllTag(@Body() req: { user_id: string }) {
    return this.tagService.findAllTag(req);
  }

  @Get(':id')
  findOneTag(@Param('id') id: string) {
    return this.tagService.findOneTag(id);
  }

  @Delete(':id')
  removeTag(@Param('id') id: string, @Body() req: { note_id: string }) {
    return this.tagService.removeTag(id, req);
  }
}
