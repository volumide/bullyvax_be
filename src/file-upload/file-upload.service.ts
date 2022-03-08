import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { FILE_UPLOAD_REPOSITORY } from '../constants';
import { FileInfo } from './file-upload.controller';
import { File, FileDto } from './file.entity';
import * as fs from 'fs';
import * as path from 'path';
import { Op } from 'sequelize';

@Injectable()
export class FileUploadService {
  constructor(
    @Inject(FILE_UPLOAD_REPOSITORY) private filesRepository: typeof File,
  ) {}
  async uploadFile(files: FileInfo[], userId: string): Promise<FileDto[]> {
    const createdFiles = [];
    if (!files) {
      throw new HttpException(
        'Upload at least one file!',
        HttpStatus.BAD_REQUEST,
      );
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      file.user_id = userId;
      try {
        const createdFile = await this.filesRepository.create(file);
        console.log('createdFile', createdFile);
        createdFiles.push(createdFile);
      } catch (error) {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
    }

    return createdFiles;
  }

  async deleteFile(fileId: string): Promise<any> {
    let deleted: any;
    try {
      deleted = await this.filesRepository.destroy({
        where: { filename: fileId },
      });
      console.log('deleted', deleted);
      if (deleted === 1) {
        fs.unlinkSync(path.join(`uploads/${fileId}`));
      } else {
        throw 'File does not exist on the server!';
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }

    return {
      message: 'Deleted successfully!',
    };
  }

  async fetchFiles(...params: any[]): Promise<FileDto[]> {
    let files: FileDto[];
    if (params.length > 0) {
      files = await this.filesRepository.findAll({
        where: { [Op.and]: [...params.map(param => param)] },
      });
    } else {
      files = await this.filesRepository.findAll();
    }

    return files;
  }
}
