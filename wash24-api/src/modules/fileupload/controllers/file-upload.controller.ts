import {
	Controller,
	Post,
	UploadedFile,
	UseInterceptors,
	Delete,
	Param,
	UploadedFiles,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { FileUploadService } from "../services/fileupload.service";

@Controller("/api/files")
export class FileUploadController {
	constructor(private readonly fileUploadService: FileUploadService) {}

	@Post("upload")
	@UseInterceptors(FileInterceptor("file"))
	async uploadFile(@UploadedFile() file: Express.Multer.File) {
		return {
			url: await this.fileUploadService.saveFile(file),
		};
	}

	@Post("multiple")
	@UseInterceptors(FilesInterceptor("files"))
	async uploadMultipleFiles(@UploadedFiles() files: Express.Multer.File[]) {
		const urls = await Promise.all(files.map((file) => this.fileUploadService.saveFile(file)));
		return { urls };
	}

	@Delete(":path")
	async deleteFile(@Param("path") path: string) {
		await this.fileUploadService.deleteFile(path);
		return { message: "File deleted successfully" };
	}
}
