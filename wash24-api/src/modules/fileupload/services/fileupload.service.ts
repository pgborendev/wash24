import { Injectable } from '@nestjs/common';
import { ensureDir, writeFile, remove } from 'fs-extra';
import { join } from 'path';
import { Express } from 'express';

@Injectable()
export class FileUploadService {
  private readonly uploadDir = join(process.cwd(), 'public', 'uploads');

  async saveFile(file: Express.Multer.File): Promise<string> {
    await ensureDir(this.uploadDir);
    
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${this.getFileExtension(file.originalname)}`;
    const filePath = join(this.uploadDir, uniqueName);
    
    await writeFile(filePath, file.buffer);
    
    return `/uploads/${uniqueName}`;
  }

  async deleteFile(filePath: string): Promise<void> {
    const fullPath = join(process.cwd(), 'public', filePath);
    await remove(fullPath);
  }

  private getFileExtension(filename: string): string {
    return filename.substring(filename.lastIndexOf('.'));
  }
}