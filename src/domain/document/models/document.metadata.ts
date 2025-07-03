export interface DocumentMetadata {
    id: string;
    type: string;
    path: string;
    status: 'uploaded' | 'processing' | 'validated' | 'failed';
    uploadedAt: string;
  }
  