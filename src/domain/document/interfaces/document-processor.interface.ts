export interface OCRResult {
    text: string;
    confidence: number;
    language: string;
  }
  
  export interface DocumentProcessor {
    process(buffer: Buffer): Promise<OCRResult>;
    extractMetadata(ocrResult: OCRResult): Record<string, any>;
    validateMetadata(metadata: Record<string, any>): boolean;
  }