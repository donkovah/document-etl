import { ICommand } from "@nestjs/cqrs";

export class UploadDocumentCommand implements ICommand {
    constructor(
      public readonly file: Express.Multer.File,
      public readonly filename: string,
    ) {}
  }
  