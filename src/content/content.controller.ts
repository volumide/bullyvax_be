import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ContentDto } from './content.entity';
import { ContentService } from './content.service';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post('create')
  createContent(@Body() content: ContentDto) {
    return this.contentService.createContent(content);
  }

  @Get()
  fetchContent(@Query('tab') tab: string, @Query('page') page: string) {
    return this.contentService.fetchContent(tab, page);
  }
}
