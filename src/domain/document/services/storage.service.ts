import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class StorageService {
  constructor(
  ) {}

  upload(file: Express.Multer.File): string {
    return `https://fake-bucket.indicium.ai/uploads/${randomUUID()}-${file.originalname}`;
  }
}
