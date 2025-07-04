import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UploadDocumentCommand } from '../commands/upload-document.command';
import { DocumentService } from '../services/document.service';
import { Document } from '../models/document.model';
import { StorageService } from '../services/storage.service';
import { ProcessDocumentCommand } from '../commands/process-document.command';

@CommandHandler(ProcessDocumentCommand)
export class ProcessDocumentHandler implements ICommandHandler<ProcessDocumentCommand> {
  constructor(
    private readonly documentService: DocumentService) {}

  async execute(command: ProcessDocumentCommand): Promise<void> {
    const { documentId } = command;

    try {
      await this.documentService.processDocument(documentId);
      console.log(`Document ${documentId} processed successfully`);
    } catch (error) {
      console.error(`Failed to process document ${documentId}:`, error);
      throw error;
    }
  }
}
