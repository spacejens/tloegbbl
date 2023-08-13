import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CoachService } from './coach.service';
import { CountController } from './count.controller';
import { RawDataController } from './raw-data.controller';

@Module({
  providers: [PrismaService, CoachService],
  controllers: [CountController, RawDataController],
})
export class PersistenceModule {}
