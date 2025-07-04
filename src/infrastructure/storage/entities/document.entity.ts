import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('documents')
export class DocumentEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  filename: string;

  @Column()
  fileUrl: string;

  @Column()
  status: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'timestamptz', nullable: true })
  createdAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  updatedAt: Date;

}
