import { Module } from '@nestjs/common';
import { DocumentService } from './document/services/document.service';
import { UploadDocumentHandler } from './document/handlers/upload-document.handler';

@Module({
  providers: [DocumentService, UploadDocumentHandler],
  exports: [DocumentService],
})
export class DomainModule {}
