import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { Express } from 'multer';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('file'))
  async uploadFile(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('folder') folder?: string,
  ) {
    const newFiles = await this.fileService.filterFiles(files);
    return this.fileService.saveFiles(newFiles, folder);
  }

  @Get('get-file/:path')
  async getFile(@Param('path') path: string, @Res() res: Response) {
    return this.fileService.getFile(path, res);
  }
}
