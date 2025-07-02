import { Injectable } from "@nestjs/common";
import { ensureDir, writeFile, remove } from "fs-extra";
import { join } from "path";
import { Express } from "express";

@Injectable()
export class FileUploadService {
	// Points to your project root's public folder (not dist)
	private readonly publicDir = join(process.cwd(), "public");
	private readonly uploadsDir = join(this.publicDir, "uploads");

	async saveFile(file: Express.Multer.File, subfolder = ""): Promise<string> {
		const targetDir = subfolder ? join(this.uploadsDir, subfolder) : this.uploadsDir;

		await ensureDir(targetDir);

		const uniqueName = this.generateUniqueFilename(file.originalname);
		const filePath = join(targetDir, uniqueName);

		await writeFile(filePath, file.buffer);

		return `/public/uploads/${subfolder ? subfolder + "/" : ""}${uniqueName}`;
	}

	async deleteFile(publicUrl: string): Promise<void> {
		// Remove '/public' prefix and leading slash if present
		const relativePath = publicUrl.replace(/^\/?public\//, "");
		const fullPath = join(this.publicDir, relativePath);
		await remove(fullPath);
	}

	private generateUniqueFilename(originalname: string): string {
		const ext = originalname.substring(originalname.lastIndexOf("."));
		const timestamp = Date.now();
		const random = Math.round(Math.random() * 1e9);
		return `${timestamp}-${random}${ext}`;
	}
}
