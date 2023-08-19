import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersistenceModule } from './persistence/persistence.module';
import { ImportModule } from './import/import.module';
import { ApiModule } from './api/api.module';

@Module({
  imports: [PersistenceModule, ImportModule, ApiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
