export interface StoragePort {
    save(documentId: string, file: Express.Multer.File): Promise<string>;
    saveMetadata(documentId: string, metadata: Record<string, any>): Promise<void>;
  }
  