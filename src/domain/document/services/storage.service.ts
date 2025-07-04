import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

// This service simulates a storage service that uploads files to a fake URL
@Injectable()
export class StorageService {
  constructor(
  ) {}

  upload(file: Express.Multer.File): string {
    return `https://fake-bucket.indicium.ai/uploads/${randomUUID()}-${file.originalname}`;
  }
}
