import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CqrsModule } from '@nestjs/cqrs';
import { DomainModule } from './domain/domain.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { AppHttpModule } from './app/appHttpModule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentEntity } from './infrastructure/storage/entities/document.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'document_management',
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
