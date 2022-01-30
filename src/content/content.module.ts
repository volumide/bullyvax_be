import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { contentProviders } from './content.providers';
import { ContentService } from './content.service';

@Module({
  controllers: [ContentController],
  providers: [ContentService, ...contentProviders]
})
export class ContentModule {}


