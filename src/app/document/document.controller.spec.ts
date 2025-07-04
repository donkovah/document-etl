import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from './document.controller';
import { CommandBus } from '@nestjs/cqrs';
import { UploadDocumentCommand } from '../../domain/document/commands/upload-document.command';

describe('DocumentController', () => {
  let controller: DocumentController;
  let commandBus: CommandBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentController],
      providers: [
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DocumentController>(DocumentController);
    commandBus = module.get<CommandBus>(CommandBus);
  });

  it('should call commandBus.execute and return document metadata', async () => {
    const file = {
      originalname: 'invoice.pdf',
      buffer: Buffer.from('PDF FILE'),
    } as Express.Multer.File;

    const body = {
      filename: 'Invoice July 2025',
    };

    const mockResult = {
      id: '123',
      status: 'PENDING',
      metadata: { type: 'invoice', extractedAt: null },
      fileUrl: '/uploads/invoice.pdf',
    };

    jest
      .spyOn(commandBus, 'execute')
      .mockResolvedValue(mockResult);

    const result = await controller.uploadDocument(file, body);

    expect(commandBus.execute).toHaveBeenCalledWith(
      new UploadDocumentCommand(file, body.filename),
    );

    expect(result).toEqual({
      id: mockResult.id,
      status: mockResult.status,
      metadata: mockResult.metadata,
      fileUrl: mockResult.fileUrl,
    });
  });
});
