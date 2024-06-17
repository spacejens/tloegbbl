import { Module } from '@nestjs/common';
import { PersistenceModule } from '../persistence/persistence.module';
import { ImportModule } from '../import/import.module';
import { CoachController } from './coach.controller';
import { TeamTypeController } from './team-type.controller';
import { TeamController } from './team.controller';
import { PlayerTypeController } from './player-type.controller';
import { AdvancementController } from './advancement.controller';
import { PlayerTypeHasAdvancementController } from './player-type-has-advancement.controller';
import { PlayerTypeInTeamTypeController } from './player-type-in-team-type.controller';
import { PlayerController } from './player.controller';

@Module({
  imports: [
    PersistenceModule,
    ImportModule,
  ],
  controllers: [CoachController, TeamTypeController, TeamController, PlayerTypeController, AdvancementController, PlayerTypeHasAdvancementController, PlayerTypeInTeamTypeController, PlayerController]
})
export class RestModule {}