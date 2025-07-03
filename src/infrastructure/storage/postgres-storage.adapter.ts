import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentEntity } from './entities/document.entity';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { StoragePort } from 'src/domain/document/interfaces/storage.interface';

@Injectable()
export class PostgresStorageAdapter implements StoragePort {
  constructor(
    @InjectRepository(DocumentEntity)
    private readonly documentRepo: Repository<DocumentEntity>,
  ) {}

  async save(documentId: string, file: Express.Multer.File): Promise<string> {
    const folderPath = join(__dirname, '..', '..', '..', 'uploads');
    const filePath = join(folderPath, `${documentId}_${file.originalname}`);

    await writeFile(filePath, file.buffer);
    return filePath;
  }

  async saveMetadata(documentId: string, metadata: Record<string, any>): Promise<void> {
    const entity = this.documentRepo.create({
      id: documentId,
      type: metadata.type,
      path: metadata.path,
      status: metadata.status,
      uploadedAt: new Date(metadata.uploadedAt),
    });
    await this.documentRepo.save(entity);
  }
}
