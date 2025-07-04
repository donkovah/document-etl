export interface OCRResult {
    confidence: number;
    language: string;
    customerName: string;
    invoiceNumber: string;
    totalAmount: number;
  }
  
  export interface DocumentProcessor {
    process(buffer: Buffer): Promise<OCRResult>;
  }