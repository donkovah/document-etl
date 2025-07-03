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
  
  @Controller('documents')
  export class DocumentController {
    constructor(private readonly commandBus: CommandBus) {}
  
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadDocument(
      @UploadedFile() file: Express.Multer.File,
      @Body() body: UploadDocumentDto,
    ) {
      const result = await this.commandBus.execute(
        new UploadDocumentCommand(file, body.documentType),
      );
  
      return {
        documentId: result.documentId,
        status: 'uploaded',
      };
    }
  }
  