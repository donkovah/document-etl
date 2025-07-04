import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UploadDocumentCommand } from '../commands/upload-document.command';
import { DocumentService } from '../services/document.service';
import { Document } from '../models/document.model';
import { randomUUID } from 'crypto';
import { StorageService } from '../services/storage.service';

@CommandHandler(UploadDocumentCommand)
export class UploadDocumentHandler implements ICommandHandler<UploadDocumentCommand> {
  constructor(
    private readonly documentService: DocumentService,
    private readonly storageService: StorageService) {}

  async execute(command: UploadDocumentCommand): Promise<Document> {
    const { file, filename } = command;
    
    return await this.documentService.uploadDocument(file, filename);
  }
}
