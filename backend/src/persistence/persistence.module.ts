import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CoachService } from './coach.service';
import { CountController } from './count.controller';
import { RawDataController } from './raw-data.controller';
import { TeamTypeService } from './team-type.service';
import { TeamService } from './team.service';
import { CompetitionService } from './competition.service';
import { TeamInCompetitionService } from './team-in-competition.service';
import { MatchService } from './match.service';
import { TeamInMatchService } from './team-in-match.service';
import { PlayerService } from './player.service';
import { PlayerTypeService } from './player-type.service';
import { AdvancementService } from './advancement.service';
import { PlayerHasAdvancementService } from './player-has-advancement.service';

@Module({
  providers: [
    PrismaService,
    CoachService,
    TeamTypeService,
    TeamService,
    CompetitionService,
    TeamInCompetitionService,
    MatchService,
    TeamInMatchService,
    PlayerService,
    PlayerTypeService,
    AdvancementService,
    PlayerHasAdvancementService,
  ],
  controllers: [CountController, RawDataController],
  exports: [
    CoachService,
    TeamTypeService,
    TeamService,
    CompetitionService,
    TeamInCompetitionService,
    MatchService,
    TeamInMatchService,
    PlayerService,
    PlayerTypeService,
    AdvancementService,
    PlayerHasAdvancementService,
  ],
})
export class PersistenceModule {}
