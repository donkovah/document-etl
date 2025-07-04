import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentEntity } from './entities/document.entity';
import { DocumentRepository } from 'src/domain/document/interfaces/document-repository.interface';
import { Document } from 'src/domain/document/models/document.model';

@Injectable()
export class DocumentRepositoryAdapter implements DocumentRepository {
  constructor(
    @InjectRepository(DocumentEntity)
    private readonly documentRepo: Repository<DocumentEntity>,
  ) {}

  async save(document: Document): Promise<Document> {
    const entity = this.documentRepo.create({
      filename: document.filename,
      fileUrl: document.fileUrl,
      status: document.status,
      metadata: document.metadata || {},
    });

    console.log('Saving document:', entity);

    const savedEntity = await this.documentRepo.save(entity);
    return Document.fromPersistence(
      savedEntity.id,
      savedEntity.filename,
      savedEntity.fileUrl,
      savedEntity.status as Document['status'],
      savedEntity.metadata || {},
      savedEntity.createdAt,
      savedEntity.updatedAt,
    );
  }

  async findById(id: string): Promise<Document | null> {
    const entity = await this.documentRepo.findOne({ where: { id } });
    if (!entity) {
      return null;
    }

    return Document.fromPersistence(
      entity.id,
      entity.filename,
      entity.fileUrl,
      entity.status as Document['status'],
      entity.metadata,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  async updateStatus(id: string, status: Document['status']): Promise<void> {
    await this.documentRepo.update(id, { status });
  }
}
