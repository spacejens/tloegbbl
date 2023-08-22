import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CoachService } from './coach.service';
import { CountController } from './count.controller';
import { RawDataController } from './raw-data.controller';
import { TeamTypeService } from './team-type.service';

@Module({
  providers: [PrismaService, CoachService, TeamTypeService],
  controllers: [CountController, RawDataController],
  exports: [CoachService, TeamTypeService],
})
export class PersistenceModule {}
