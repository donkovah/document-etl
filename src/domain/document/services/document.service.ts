import { Inject, Injectable } from '@nestjs/common';
import { DocumentRepository } from '../interfaces/document-repository.interface';
import { QueueInterface } from '../interfaces/queue.interface';
import { Document, DocumentStatus } from '../models/document.model';
import { StorageService } from './storage.service';
import { DocumentProcessor } from '../interfaces/document-processor.interface';

@Injectable()
export class DocumentService {
  constructor(
    @Inject('StoragePort') private readonly documentRepository: DocumentRepository,
    @Inject('QueuePort') private readonly queueBroker: QueueInterface,
    @Inject('OCRPort') private readonly documentProcessor: DocumentProcessor,
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
        // An outbox pattern could be used here to ensure the job is only added 
        // if the document is saved successfully
        console.log(`Enqueuing document ${savedDocument.id} for processing`);
        await this.queueBroker.enqueueDocument(savedDocument.id);
    
        console.log('Document upload and enqueue successful');
        return savedDocument;
    } catch (error) {
        console.error('Error uploading document:', error);
        throw new Error('Document upload failed');
    }
  }

  async processDocument(documentId: string): Promise<void> {
    const document = await this.documentRepository.findById(documentId);
    if (!document || !document.id) {
      throw new Error(`Document with id ${documentId} not found`);
    }

    try {
      // Mark as processing
      document.status = DocumentStatus.PROCESSING;
      const updatedDocument = await this.documentRepository.updateStatus(document.id, DocumentStatus.PROCESSING);

      // Process the document (OCR, validation, etc.)
      const file = this.storageService.download(document.fileUrl);
      await this.documentProcessor.process(file.buffer);
      
      // Mark as validated
      document.status = DocumentStatus.VALIDATED;
      await this.documentRepository.updateStatus(document.id, DocumentStatus.VALIDATED);
      console.log(`Document ${document.id} processed and validated successfully`);
      
    } catch (error) {
      document.status = DocumentStatus.FAILED;
      await this.documentRepository.save(document);
      throw error;
    }
  }
}
