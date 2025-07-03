export interface QueuePort {
    enqueueDocument(documentId: string): Promise<void>;
  }