export class UploadDocumentCommand {
    constructor(
      public readonly file: Express.Multer.File,
      public readonly documentType: string,
    ) {}
  }
  