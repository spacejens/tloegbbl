import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CoachService } from './coach.service';
import { CountController } from './count.controller';
import { RawDataController } from './raw-data.controller';
import { TeamTypeService } from './team-type.service';
import { TeamService } from './team.service';
import { CompetitionService } from './competition.service';

@Module({
  providers: [
    PrismaService,
    CoachService,
    TeamTypeService,
    TeamService,
    CompetitionService,
  ],
  controllers: [CountController, RawDataController],
  exports: [CoachService, TeamTypeService, TeamService, CompetitionService],
})
export class PersistenceModule {}
