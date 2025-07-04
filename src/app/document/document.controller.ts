import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CommandBus } from '@nestjs/cqrs';
import { UploadDocumentDto } from './dtos/upload-document.dto';
import { UploadDocumentCommand } from 'src/domain/document/commands/upload-document.command';
import { Document } from 'src/domain/document/models/document.model';
import { UploadDocumentHandler } from 'src/domain/document/handlers/upload-document.handler';

@Controller('documents')
export class DocumentController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadDocumentDto,
  ) {
    const result = await this.commandBus.execute<UploadDocumentCommand>(
      new UploadDocumentCommand(file, body.filename),
    );
    console.log('Document uploaded:', result);

    return {
      id: result.id,
      status: result.status,
      metadata: result.metadata,
      fileUrl: result.fileUrl,
    };
  }
}
