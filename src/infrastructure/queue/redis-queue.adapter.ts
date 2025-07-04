import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { QueueInterface } from 'src/domain/document/interfaces/queue.interface';

@Injectable()
export class RedisQueueAdapter implements QueueInterface, OnModuleDestroy {
  private readonly redisClient: RedisClientType;

  constructor() {
    this.redisClient = createClient()
    this.redisClient.on('error', (err) => {
        console.error('Redis Client Error', err);
      });
    this.redisClient.connect();
  }

  async enqueueDocument(documentId: string): Promise<void> {
    await this.redisClient.lPush('document:queue', documentId);
  }

  async dequeueDocument(): Promise<string | null> {
    // Use blocking pop to wait for items
    const result = await this.redisClient.brPop('document:queue', 5); // Wait for up to 5 seconds
    return result?.element || null;
  }

  async close(): Promise<void> {
    await this.redisClient.quit();
  }

  async onModuleDestroy() {
    await this.close();
  }
}
