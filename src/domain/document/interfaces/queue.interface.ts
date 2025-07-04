export interface QueueInterface {
    enqueueDocument(documentId: string, options: { documentId: string }): Promise<void>;
  }