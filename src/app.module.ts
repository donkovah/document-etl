import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CqrsModule } from '@nestjs/cqrs';
import { DomainModule } from './domain/domain.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { AppHttpModule } from './app/appHttpModule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentEntity } from './infrastructure/storage/entities/document.entity';
import { config } from './config/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      url: config.POSTGRES_URL || 'postgresql://postgres:password@localhost:5432/document_management',
      type: 'postgres',
      database: config.POSTGRES_DATABASE || 'document_management',
      entities: [DocumentEntity],
      synchronize: true,
    }),
    CqrsModule.forRoot(),
    AppHttpModule,
    DomainModule,
    InfrastructureModule,
  ],
  controllers: [AppController],
  providers: [AppService], 
})
export class AppModule {}
