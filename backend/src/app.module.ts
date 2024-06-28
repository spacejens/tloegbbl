import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersistenceModule } from './persistence/persistence.module';
import { ImportModule } from './import/import.module';
import { RestModule } from './rest/rest.module';

@Module({
  imports: [PersistenceModule, ImportModule, RestModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
