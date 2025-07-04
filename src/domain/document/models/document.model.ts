export enum DocumentStatus {
  UPLOADED = 'uploaded',
  PROCESSING = 'processing',
  VALIDATED = 'validated',
  FAILED = 'failed',
}

export class Document {
  constructor(
    public readonly id: string | null ,
    public filename: string,
    public fileUrl: string,
    public status: DocumentStatus = DocumentStatus.UPLOADED,
    public metadata?: Record<string, any>,
    private readonly createdAt: Date | null = null,
    private readonly updatedAt: Date | null = null,
  ) {}

  static create(filename: string, fileUrl: string): Document {
    return new Document(null, filename, fileUrl);
  }

  static fromPersistence(
    id: string,
    filename: string,
    fileUrl: string,
    status: DocumentStatus,
    metadata: Record<string, any>,
    createdAt: Date,
    updatedAt: Date,
  ): Document {
    return new Document(id, filename, fileUrl, status, metadata, createdAt, updatedAt);
  }  
}