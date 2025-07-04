import { Document } from "../models/document.model";

export interface DocumentRepository {
  save(document: Document): Promise<Document>;
  findById(id: string): Promise<Document | null>;
  updateStatus(id: string, status: Document['status']): Promise<void>;
}
