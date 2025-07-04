import { IsString, IsNotEmpty } from 'class-validator';

export class UploadDocumentDto {
  @IsString()
  @IsNotEmpty()
  filename: string;

  @IsNotEmpty()
  file: Express.Multer.File;
}