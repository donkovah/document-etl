import { ProcessDocumentHandler } from './process-document.handler';
import { DocumentService } from '../services/document.service';
import { ProcessDocumentCommand } from '../commands/process-document.command';

describe('ProcessDocumentHandler', () => {
  let handler: ProcessDocumentHandler;
  let documentService: jest.Mocked<DocumentService>;

  beforeEach(() => {
    documentService = {
      processDocument: jest.fn(),
    } as unknown as jest.Mocked<DocumentService>;

    handler = new ProcessDocumentHandler(documentService);
  });

  it('should process the document successfully', async () => {
    const command = new ProcessDocumentCommand('doc-123');
    documentService.processDocument.mockResolvedValueOnce(undefined);

    await handler.execute(command);

    expect(documentService.processDocument).toHaveBeenCalledWith('doc-123');
  });

  it('should throw an error if documentService.processDocument fails', async () => {
    const command = new ProcessDocumentCommand('doc-123');
    const error = new Error('Processing failed');

    documentService.processDocument.mockRejectedValueOnce(error);

    await expect(handler.execute(command)).rejects.toThrow('Processing failed');
    expect(documentService.processDocument).toHaveBeenCalledWith('doc-123');
  });
});
