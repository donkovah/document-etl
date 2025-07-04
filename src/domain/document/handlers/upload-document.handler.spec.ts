import { UploadDocumentHandler } from './upload-document.handler';
import { DocumentService } from '../services/document.service';
import { UploadDocumentCommand } from '../commands/upload-document.command';
import { Document } from '../models/document.model';

describe('UploadDocumentHandler', () => {
  let handler: UploadDocumentHandler;
  let documentService: jest.Mocked<DocumentService>;

  const mockFile = {
    buffer: Buffer.from('fake content'),
    originalname: 'test.pdf',
    mimetype: 'application/pdf',
  } as Express.Multer.File;

  const filename = 'test.pdf';

  const mockDocument = Document.create(filename, 'http://localhost/documents/doc-123.pdf');

  beforeEach(() => {
    documentService = {
      uploadDocument: jest.fn(),
    } as unknown as jest.Mocked<DocumentService>;

    handler = new UploadDocumentHandler(documentService);
  });

  it('should upload and return a Document object', async () => {
    const command = new UploadDocumentCommand(mockFile, filename);
    documentService.uploadDocument.mockResolvedValueOnce(mockDocument);

    const result = await handler.execute(command);

    expect(documentService.uploadDocument).toHaveBeenCalledWith(mockFile, filename);
    expect(result).toBeInstanceOf(Document);
    expect(result.filename).toBe(filename);
    expect(result.fileUrl).toContain('localhost/documents/');
    expect(result.status).toBe('uploaded');
  });

  it('should throw if uploadDocument fails', async () => {
    const command = new UploadDocumentCommand(mockFile, filename);
    const error = new Error('upload failed');
    documentService.uploadDocument.mockRejectedValueOnce(error);

    await expect(handler.execute(command)).rejects.toThrow('upload failed');
    expect(documentService.uploadDocument).toHaveBeenCalledWith(mockFile, filename);
  });
});
