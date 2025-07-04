import { OCRResult } from "src/domain/document/interfaces/document-processor.interface";

export async function simulateOCR(imageBuffer: Buffer): Promise<OCRResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        text: "This is a simulated OCR result.",
        confidence: 0.98,
        language: "en",
      });
    }, 500);
  });
}
