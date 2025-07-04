import { Inject, Injectable } from '@nestjs/common';
import { DocumentRepository } from '../interfaces/document-repository.interface';
import { QueueInterface } from '../interfaces/queue.interface';
import { Document } from '../models/document.model';
import { StorageService } from './storage.service';

@Injectable()
export class DocumentService {
  constructor(
    @Inject('StoragePort') private readonly documentRepository: DocumentRepository,
    @Inject('QueuePort') private readonly queueBroker: QueueInterface,
    private readonly storageService: StorageService,
  ) {}

  async uploadDocument(file:Express.Multer.File, filename: string): Promise<Document> {
    const fileUrl = this.storageService.upload(file);
    const document =  Document.create(filename, fileUrl);
    const savedDocument = await this.documentRepository.save(document);
    if (!savedDocument.id) {
      throw new Error('Document could not be saved');   
    }

    // Add job to Redis queue for async processing
    await this.queueBroker.enqueueDocument('process-document', {
      documentId: savedDocument.id,
    });

    return savedDocument;
  }
}
