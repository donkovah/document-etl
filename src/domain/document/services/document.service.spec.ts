import { DocumentService } from './document.service';
import { Document, DocumentStatus } from '../models/document.model';
import { QueueInterface } from '../interfaces/queue.interface';
import { DocumentRepository } from '../interfaces/document-repository.interface';
import { StorageService } from './storage.service';
import { DocumentProcessor } from '../interfaces/document-processor.interface';

describe('DocumentService', () => {
  let service: DocumentService;
  let mockRepository: jest.Mocked<DocumentRepository>;
  let mockQueue: jest.Mocked<QueueInterface>;
  let mockStorageService: jest.Mocked<StorageService>;
  let mockProcessor: jest.Mocked<DocumentProcessor>;

  const file = {
    buffer: Buffer.from('fake data'),
    originalname: 'test.pdf',
    mimetype: 'application/pdf',
  } as Express.Multer.File;

  const fileUrl = 'http://localhost/test.pdf';
  const filename = 'test.pdf';

  const savedDoc = new Document('123', filename, fileUrl, DocumentStatus.UPLOADED);

  beforeEach(() => {
    mockRepository = {
      save: jest.fn().mockResolvedValue(savedDoc),
      findById: jest.fn(),
      updateStatus: jest.fn(),
    } as unknown as jest.Mocked<DocumentRepository>;

    mockQueue = {
      enqueueDocument: jest.fn().mockResolvedValue(undefined),
      dequeueDocument: jest.fn().mockResolvedValue(null),
      close: jest.fn().mockResolvedValue(undefined),
    };

    mockStorageService = {
      upload: jest.fn().mockReturnValue(fileUrl),
      download: jest.fn().mockReturnValue({ buffer: file.buffer }),
    } as unknown as jest.Mocked<StorageService>;

    mockProcessor = {
      process: jest.fn().mockResolvedValue(undefined),
    };

    service = new DocumentService(
      mockRepository,
      mockQueue,
      mockProcessor,
      mockStorageService,
    );
  });

  describe('uploadDocument', () => {
    it('should upload, save, and enqueue a document', async () => {
      const result = await service.uploadDocument(file, filename);

      expect(mockStorageService.upload).toHaveBeenCalledWith(file);
      expect(mockRepository.save).toHaveBeenCalled();
      expect(mockQueue.enqueueDocument).toHaveBeenCalledWith(savedDoc.id);
      expect(result).toEqual(savedDoc);
    });

    it('should throw an error if save fails (no id)', async () => {
      mockRepository.save.mockResolvedValueOnce(
        new Document(null, filename, fileUrl),
      );

      await expect(service.uploadDocument(file, filename)).rejects.toThrow(
        'Document upload failed',
      );
    });

    it('should throw a wrapped error if upload fails', async () => {
      mockRepository.save.mockRejectedValueOnce(new Error('DB error'));

      await expect(service.uploadDocument(file, filename)).rejects.toThrow(
        'Document upload failed',
      );
    });
  });

  describe('processDocument', () => {
    const processingDoc = new Document(
      '123',
      filename,
      fileUrl,
      DocumentStatus.UPLOADED,
    );

    it('should process and validate a document', async () => {
      mockRepository.findById.mockResolvedValueOnce(processingDoc);
      mockRepository.updateStatus.mockResolvedValueOnce(undefined);

      await service.processDocument(processingDoc.id!);

      expect(mockRepository.findById).toHaveBeenCalledWith(processingDoc.id);
      expect(mockRepository.updateStatus).toHaveBeenCalledWith(
        processingDoc.id,
        DocumentStatus.PROCESSING,
      );
      expect(mockStorageService.download).toHaveBeenCalledWith(fileUrl);
      expect(mockProcessor.process).toHaveBeenCalledWith(file.buffer);
      expect(mockRepository.updateStatus).toHaveBeenCalledWith(
        processingDoc.id,
        DocumentStatus.VALIDATED,
      );
    });

    it('should mark as failed if processing throws', async () => {
      mockRepository.findById.mockResolvedValueOnce(processingDoc);
      mockRepository.updateStatus.mockResolvedValueOnce(undefined);
      mockProcessor.process.mockRejectedValueOnce(new Error('OCR failed'));

      await expect(
        service.processDocument(processingDoc.id!),
      ).rejects.toThrow('OCR failed');

      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: processingDoc.id,
          status: DocumentStatus.FAILED,
        }),
      );
    });

    it('should throw if document not found', async () => {
      mockRepository.findById.mockResolvedValueOnce(null);

      await expect(service.processDocument('not-found')).rejects.toThrow(
        'Document with id not-found not found',
      );
    });
  });
});
