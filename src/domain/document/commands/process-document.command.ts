import { ICommand } from "@nestjs/cqrs";

export class ProcessDocumentCommand implements ICommand {
    constructor(
      public readonly documentId: string,
    ) {}
  }
  