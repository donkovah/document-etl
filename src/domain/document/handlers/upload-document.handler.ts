import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UploadDocumentCommand } from '../upload-document.command';
import { DocumentService } from '../../services/document.service';

@CommandHandler(UploadDocumentCommand)
export class UploadDocumentHandler implements ICommandHandler<UploadDocumentCommand> {
  constructor(private readonly documentService: DocumentService) {}

  async execute(command: UploadDocumentCommand): Promise<{ documentId: string }> {
    return this.documentService.uploadDocument(command.file, command.documentType);
  }
}
