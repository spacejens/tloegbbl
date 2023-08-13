import { Module } from '@nestjs/common';
import { ImportController } from './import.controller';
import { CoachImportService } from './coach-import.service';
import { PersistenceModule } from '../persistence/persistence.module';

@Module({
  imports: [PersistenceModule],
  controllers: [ImportController],
  providers: [CoachImportService],
})
export class ImportModule {}
