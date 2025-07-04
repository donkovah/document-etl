import { InvoiceProcessorOCR } from './invoice-processor.ocr';

describe('InvoiceProcessorOCR', () => {
  let processor: InvoiceProcessorOCR;

  beforeEach(() => {
    processor = new InvoiceProcessorOCR();
  });

  describe('process', () => {
    it('should return valid OCR result', async () => {
      const dummyBuffer = Buffer.from('dummy-pdf-content');
      
      const result = await processor.process(dummyBuffer);

      expect(result).toEqual({
        customerName: "John Doe",
        invoiceNumber: "INV-123456",
        totalAmount: 1250.50,
        confidence: 0.98,
        language: "en",
      });
    });

    it('should resolve within reasonable time (under 600ms)', async () => {
      const dummyBuffer = Buffer.from('dummy');
      const start = Date.now();
      await processor.process(dummyBuffer);
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(600);
    });
  });

  describe('validateMetadata', () => {
    it('should return true for valid metadata', () => {
      const metadata = {
        customerName: "Alice",
        invoiceNumber: "INV-001",
        totalAmount: 999.99,
      };

      expect(processor.validateMetadata(metadata)).toBe(true);
    });

    it('should return false if any required field is missing', () => {
      const cases = [
        { invoiceNumber: "INV-001", totalAmount: 999.99 },
        { customerName: "Alice", totalAmount: 999.99 },
        { customerName: "Alice", invoiceNumber: "INV-001" },
      ];

      cases.forEach((metadata) => {
        expect(processor.validateMetadata(metadata)).toBe(false);
      });
    });
  });
});
