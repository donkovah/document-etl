import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';
import { QueuePort } from 'src/domain/document/interfaces/queue.interface';

@Injectable()
export class RedisQueueAdapter implements QueuePort {
  private readonly redisClient = createClient();

  constructor() {
    this.redisClient.connect();
  }

  async enqueueDocument(documentId: string): Promise<void> {
    await this.redisClient.lPush('document:queue', documentId);
  }
}
