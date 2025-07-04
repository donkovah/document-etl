
import { DocumentProcessor, OCRResult } from "src/domain/document/interfaces/document-processor.interface";
import { simulateOCR } from "../ocr/simulateOCR";

export class InvoiceProcessor implements DocumentProcessor {
  async process(buffer: Buffer): Promise<OCRResult> {
    return simulateOCR(buffer);
  }

  extractMetadata(ocrResult: OCRResult) {
    return {
      customerName: "John Doe",
      invoiceNumber: "INV-123456",
      totalAmount: 1250.50,
      confidence: ocrResult.confidence,
    };
  }

  validateMetadata(metadata: Record<string, any>): boolean {
    return !!metadata.customerName && !!metadata.invoiceNumber && !!metadata.totalAmount;
  }
}
