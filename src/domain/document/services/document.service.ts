import { Inject, Injectable } from '@nestjs/common';
import { DocumentRepository } from '../interfaces/document-repository.interface';
import { QueueInterface } from '../interfaces/queue.interface';
import { Document, DocumentStatus } from '../models/document.model';
import { StorageService } from './storage.service';

@Injectable()
export class DocumentService {
  constructor(
    @Inject('StoragePort') private readonly documentRepository: DocumentRepository,
    @Inject('QueuePort') private readonly queueBroker: QueueInterface,
    private readonly storageService: StorageService,
  ) {}

  async uploadDocument(file:Express.Multer.File, filename: string): Promise<Document> {
    try {
        const fileUrl = this.storageService.upload(file);
        const document =  Document.create(filename, fileUrl);
        const savedDocument = await this.documentRepository.save(document);
        if (!savedDocument.id) {
          throw new Error('Document could not be saved');   
        }
    
        // Add job to Redis queue for async processing
        await this.queueBroker.enqueueDocument(savedDocument.id);
    
        return document;
    } catch (error) {
        console.error('Error uploading document:', error);
        throw new Error('Document upload failed');
    }
  }

  async processDocument(documentId: string): Promise<void> {
    const document = await this.documentRepository.findById(documentId);
    if (!document) {
      throw new Error(`Document with id ${documentId} not found`);
    }

    try {
      // Mark as processing
      document.status = DocumentStatus.PROCESSING;
      const updatedDocument = await this.documentRepository.save(document);

      // Process the document (OCR, validation, etc.)
      // This would involve other services/ports
      
      // Mark as validated
      updatedDocument.status = DocumentStatus.VALIDATED;
      await this.documentRepository.save(updatedDocument);
      
    } catch (error) {
      document.status = DocumentStatus.FAILED;
      await this.documentRepository.save(document);
      throw error;
    }
  }
}
