import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentEntity } from './storage/entities/document.entity';
import { PostgresStorageAdapter } from './storage/document-repository.adapter';
import { RedisQueueAdapter } from './queue/redis-queue.adapter';
import { QueueConsumerService } from './queue/queue-consumer.service';
import { InvoiceProcessorOCR } from './ocrs/invoice-processor.ocr';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentEntity])],
  providers: [
    {
      provide: 'StoragePort',
      useClass: PostgresStorageAdapter,
    },
    {
      provide: 'QueuePort',
      useClass: RedisQueueAdapter,
    },
    {
      provide: 'OCRPort',
      useClass: InvoiceProcessorOCR,
    },
    QueueConsumerService,
  ],
  exports: ['StoragePort', 'QueuePort', 'OCRPort'],
})
export class InfrastructureModule {}
