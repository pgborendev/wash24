import { Controller, Post, UploadedFile, UseInterceptors, Delete, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from '../services/fileupload.service'; 
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('files')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      url: await this.fileUploadService.saveFile(file),
    };
  }

  @Delete(':path')
  async deleteFile(@Param('path') path: string) {
    await this.fileUploadService.deleteFile(path);
    return { message: 'File deleted successfully' };
  }
}