import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('documents')
export class DocumentEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  type: string;

  @Column()
  path: string;

  @Column()
  status: string;

  @Column({ type: 'timestamptz' })
  uploadedAt: Date;
}
