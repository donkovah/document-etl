import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
