import { Inject, Injectable } from '@nestjs/common';
import { CONTENT_REPOSITORY } from 'src/constants';
import { Content, ContentDto } from './content.entity';
import { v4 as uuidGenerator } from 'uuid';
import { Op } from 'sequelize';

@Injectable()
export class ContentService {
    constructor(
        @Inject(CONTENT_REPOSITORY) private contentRepository: typeof Content,
    ) {}

    async createContent(content: ContentDto): Promise<Content> {
        content.content_id = uuidGenerator();
        let operation: any;
        if (content.tab && content.page) {
            operation = { [Op.and]: [{tab: content.tab}, {page: content.page}] };
        } else {
            operation = { page: content.page };
        }
        const existingContent = await this.contentRepository.findOne({ where: operation });
        if (existingContent) {
            return await existingContent.update(content);
        } 
        return await this.contentRepository.create(content);
    }

    async fetchContent(tab: string, page: string): Promise<Content> {
        let operation: any;
        if (tab && page) {
            operation = { [Op.and]: [{tab}, {page}] };
        } else {
            operation = { page };
        }
        return await this.contentRepository.findOne({ where: operation });
    }
}
