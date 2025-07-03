import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { StoragePort } from '../interfaces/storage.interface';
import { QueuePort } from '../interfaces/queue.interface';

@Injectable()
export class DocumentService {
  constructor(
    @Inject('StoragePort') private readonly storage: StoragePort,
    @Inject('QueuePort') private readonly queue: QueuePort,
  ) {}

  async uploadDocument(file: Express.Multer.File, documentType: string) {
    const documentId = uuidv4();
    const filePath = await this.storage.save(documentId, file);

    const metadata = {
      id: documentId,
      type: documentType,
      path: filePath,
      status: 'uploaded',
      uploadedAt: new Date().toISOString(),
    };

    await this.storage.saveMetadata(documentId, metadata);
    await this.queue.enqueueDocument(documentId);

    return { documentId };
  }
}
