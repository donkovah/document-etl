import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UploadDocumentCommand } from '../commands/upload-document.command';
import { DocumentService } from '../services/document.service';
import { Document } from '../models/document.model';

@CommandHandler(UploadDocumentCommand)
export class UploadDocumentHandler implements ICommandHandler<UploadDocumentCommand> {
  constructor(
    private readonly documentService: DocumentService) {}

  async execute(command: UploadDocumentCommand): Promise<Document> {
    const { file, filename } = command;
    
    try {
        // Uploading file to storage
        const document =  await this.documentService.uploadDocument(file, filename)
        console.log(`Document ${filename} processed successfully`);
        return document;
      } catch (error) {
        console.error(`Failed to upload document ${filename}:`, error);
        throw error;
      }
  }
}
