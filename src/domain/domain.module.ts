import { Module } from '@nestjs/common';
import { DocumentService } from './document/services/document.service';
import { UploadDocumentHandler } from './document/handlers/upload-document.handler';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';
import { StorageService } from './document/services/storage.service';
import { ProcessDocumentHandler } from './document/handlers/process-document.handler';

@Module({
  imports: [InfrastructureModule],
  providers: [DocumentService, UploadDocumentHandler, ProcessDocumentHandler,  StorageService],
  exports: [DocumentService],
})
export class DomainModule {}
