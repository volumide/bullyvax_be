import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express/multer/multer.module';
import { DatabaseModule } from '../database/database.module';
import { FileUploadController } from './file-upload.controller';
import { fileUploadProviders } from './file-upload.providers';
import { FileUploadService } from './file-upload.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    DatabaseModule
  ],
  controllers: [FileUploadController],
  providers: [FileUploadService, ...fileUploadProviders]
})
export class FileUploadModule {}
