import { Module } from "@nestjs/common";
import { DocumentController } from "./document/document.controller";

@Module({
    controllers: [DocumentController],
  })
  export class AppHttpModule {}
  