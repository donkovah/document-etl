
import { DocumentProcessor, OCRResult } from "src/domain/document/interfaces/document-processor.interface";
import { Injectable } from "@nestjs/common";

@Injectable()
export class InvoiceProcessorOCR implements DocumentProcessor {
    constructor() {}

  process(_file: Buffer):Promise<OCRResult> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                customerName: "John Doe",
                invoiceNumber: "INV-123456",
                totalAmount: 1250.50,
                confidence: 0.98,
                language: "en",
              });
        }, 500);
    });
  }

  validateMetadata(metadata: Record<string, any>): boolean {
    return !!metadata.customerName && !!metadata.invoiceNumber && !!metadata.totalAmount;
  }
}
