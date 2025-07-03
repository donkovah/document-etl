import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentEntity } from './storage/entities/document.entity';
import { PostgresStorageAdapter } from './storage/postgres-storage.adapter';
import { RedisQueueAdapter } from './queue/redis-queue.adapter';

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
  ],
  exports: [PostgresStorageAdapter, RedisQueueAdapter],
})
export class InfrastructureModule {}
