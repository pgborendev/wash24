import { Module } from "@nestjs/common";
import { FileUploadService } from "./services/fileupload.service";
import { FileUploadController } from "./controllers/file-upload.controller";

@Module({
	imports: [],
	controllers: [FileUploadController],
	providers: [FileUploadService],
	exports: [FileUploadService],
})
export class FileuploadModule {}
