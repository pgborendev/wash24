import { forwardRef, Module } from '@nestjs/common';
import { FileUploadService } from './services/fileupload.service'; 
import { FileUploadController } from './controllers/file-upload.controller';
import { BusinessModule } from '../bussiness/business.module';

@Module({
  imports: [
  ],
  controllers: [FileUploadController],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class FileuploadModule {}
