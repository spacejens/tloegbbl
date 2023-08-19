import { Module } from '@nestjs/common';
import { ImportController } from './import.controller';
import { CoachImportService } from './coach-import.service';
import { PersistenceModule } from '../persistence/persistence.module';
import { CombineDataService } from './combine-data.service';

@Module({
  imports: [PersistenceModule],
  controllers: [ImportController],
  providers: [CoachImportService, CombineDataService],
})
export class ImportModule {}
