import { DocumentRepositoryAdapter } from './document-repository.adapter';
import { Repository } from 'typeorm';
import { DocumentEntity } from './entities/document.entity';
import { Document, DocumentStatus } from '../../domain/document/models/document.model';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('DocumentRepositoryAdapter', () => {
  let adapter: DocumentRepositoryAdapter;
  let mockRepo: jest.Mocked<Repository<DocumentEntity>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DocumentRepositoryAdapter,
        {
          provide: getRepositoryToken(DocumentEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    adapter = module.get(DocumentRepositoryAdapter);
    mockRepo = module.get(getRepositoryToken(DocumentEntity));
  });

  describe('save', () => {
    it('should save and return a document', async () => {
      const mockDocument = Document.create('filename.pdf', 'http://localhost/documents/doc.pdf');

      const mockEntity: Partial<DocumentEntity> = {
        id: 'doc-123',
        filename: mockDocument.filename,
        fileUrl: mockDocument.fileUrl,
        status: mockDocument.status,
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepo.create.mockReturnValue(mockEntity as DocumentEntity);
      mockRepo.save.mockResolvedValue(mockEntity as DocumentEntity);

      const result = await adapter.save(mockDocument);

      expect(mockRepo.create).toHaveBeenCalledWith({
        filename: mockDocument.filename,
        fileUrl: mockDocument.fileUrl,
        status: mockDocument.status,
        metadata: {},
      });

      expect(mockRepo.save).toHaveBeenCalledWith(mockEntity);
      expect(result.id).toBe('doc-123');
      expect(result.filename).toBe('filename.pdf');
    });
  });

  describe('findById', () => {
    it('should return a Document if found', async () => {
      const mockEntity: DocumentEntity = {
        id: 'doc-456',
        filename: 'invoice.pdf',
        fileUrl: 'http://localhost/documents/invoice.pdf',
        status: DocumentStatus.UPLOADED,
        metadata: { invoiceNumber: 'INV-1' },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepo.findOne.mockResolvedValue(mockEntity);

      const result = await adapter.findById('doc-456');

      expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 'doc-456' } });
      expect(result?.id).toBe('doc-456');
      expect(result?.filename).toBe('invoice.pdf');
    });

    it('should return null if not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      const result = await adapter.findById('nonexistent-id');

      expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 'nonexistent-id' } });
      expect(result).toBeNull();
    });
  });

  describe('updateStatus', () => {
    it('should update the status of a document', async () => {
      mockRepo.update.mockResolvedValue({} as any);

      await adapter.updateStatus('doc-789', DocumentStatus.VALIDATED);

      expect(mockRepo.update).toHaveBeenCalledWith('doc-789', {
        status: DocumentStatus.VALIDATED,
      });
    });
  });
});
