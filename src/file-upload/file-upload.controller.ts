import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { FileDto } from './file.entity';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { Observable, of } from 'rxjs';
import { extname, join } from 'path';
import { diskStorage } from 'multer';
import path = require('path');
import { v4 as uuidGenerator } from 'uuid';

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

  @Post('upload')
  @UseInterceptors(
    AnyFilesInterceptor({
      limits: {
        fileSize: 15000000,
      },
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename: string =
            path.parse(file.originalname).name.replace(/\s/g, '') +
            uuidGenerator();
          const extension: string = path.parse(file.originalname).ext;

          cb(null, `${filename}${extension}`);
        },
      }),
    }),
  )
  uploadFile(@UploadedFiles() file: FileInfo[], @Query('id') userId) {
    // console.log(userId);
    return this.fileUploadService.uploadFile(file, userId);
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

  @Get('image/:img')
  getImage(@Param('img') img, @Res() res): Observable<Object> {
    return of(res.sendFile(join(process.cwd(), 'uploads/' + img)));
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @Delete(':file_id')
  deleteFile(@Param('file_id') fileId: string): any {
    return this.fileUploadService.deleteFile(fileId);
  }
}
