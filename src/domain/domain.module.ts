import { Module } from '@nestjs/common';
import { DocumentService } from './document/services/document.service';
import { UploadDocumentHandler } from './document/handlers/upload-document.handler';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';

@Module({
  imports: [InfrastructureModule],
  providers: [DocumentService, UploadDocumentHandler],
  exports: [DocumentService],
})
export class DomainModule {}
