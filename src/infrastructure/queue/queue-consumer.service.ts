import { Injectable, OnModuleInit, OnModuleDestroy, Inject } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { QueueInterface } from 'src/domain/document/interfaces/queue.interface';
import { ProcessDocumentCommand } from 'src/domain/document/commands/process-document.command';

@Injectable()
export class QueueConsumerService implements OnModuleInit, OnModuleDestroy {
  private isRunning = false;
  private processingPromise: Promise<void> | null = null;

  constructor(
    @Inject('QueuePort')private readonly queueService: QueueInterface,
    private readonly commandBus: CommandBus,
  ) {}

  async onModuleInit() {
      await this.startConsuming();
  }

  async onModuleDestroy() {
    await this.stopConsuming();
  }

  async startConsuming(): Promise<void> {
    if (this.isRunning) {
      console.log('Queue consumer is already running');
      return;
    }

    this.isRunning = true;
    console.log('Starting queue consumer...');

    this.processingPromise = this.processQueue();
  }

  async stopConsuming(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    console.log('Stopping queue consumer...');
    this.isRunning = false;

    if (this.processingPromise) {
      await this.processingPromise;
    }
  }

  private async processQueue(): Promise<void> {
    while (this.isRunning) {
      try {
        const documentId = await this.queueService.dequeueDocument();
        
        if (documentId) {
          console.log(`Processing document: ${documentId}`);
          
          // Trigger the ProcessDocumentCommand
          await this.commandBus.execute(new ProcessDocumentCommand(documentId));
          
          console.log(`Document ${documentId} processing completed`);
        }
      } catch (error) {
        console.error('Error processing queue item:', error);
        
        //avoid tight error loops
        await this.sleep(5000);
      }
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}