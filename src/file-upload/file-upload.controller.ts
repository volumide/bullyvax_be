import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { FileDto } from './file.entity';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';

export interface FileInfo {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
  user_id?: string;
}

@Controller('file-upload')
export class FileUploadController {
  constructor(private fileUploadService: FileUploadService) {}

  //   @UseGuards(JwtAuthGuard)
  //   @ApiBearerAuth('Authorization')
  @Post('upload')
  @UseInterceptors(
    AnyFilesInterceptor({
      limits: {
        fileSize: 15000000,
      },
    }),
  )
  uploadFile(@UploadedFiles() files: FileInfo[]): Promise<FileDto[]> {
    return this.fileUploadService.uploadFile(files);
  }

  @Get('fetch')
  @ApiQuery({ name: 'file_id', required: false })
  @ApiQuery({ name: 'date_created', required: false })
  fetchFiles(
    @Query('file_id') fileId?: string,
    @Query('date_created') dateCreated?: string,
  ): Promise<FileDto[]> {
    const args = [{ filename: fileId }, { createdAt: dateCreated }].filter(
      arg => {
        const argKeys = Object.keys(arg);
        if (arg[argKeys[0]]) {
          return arg;
        }
      },
    );

    return this.fileUploadService.fetchFiles(...args);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @Delete(':file_id')
  deleteFile(@Param('file_id') fileId: string): any {
    return this.fileUploadService.deleteFile(fileId);
  }
}
