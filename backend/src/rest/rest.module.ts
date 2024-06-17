import { Module } from '@nestjs/common';
import { PersistenceModule } from '../persistence/persistence.module';
import { ImportModule } from '../import/import.module';
import { CoachController } from './coach.controller';
import { TeamTypeController } from './team-type.controller';
import { TeamController } from './team.controller';
import { PlayerTypeController } from './player-type.controller';
import { AdvancementController } from './advancement.controller';

@Module({
  imports: [
    PersistenceModule,
    ImportModule,
  ],
  controllers: [CoachController, TeamTypeController, TeamController, PlayerTypeController, AdvancementController]
})
export class RestModule {}
