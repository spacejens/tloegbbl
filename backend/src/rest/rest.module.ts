import { Module } from '@nestjs/common';
import { PersistenceModule } from '../persistence/persistence.module';
import { ImportModule } from '../import/import.module';
import { CoachController } from './coach.controller';
import { TeamTypeController } from './team-type.controller';

@Module({
  imports: [
    PersistenceModule,
    ImportModule,
  ],
  controllers: [CoachController, TeamTypeController]
})
export class RestModule {}
