import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CoachService } from './coach.service';
import { CountController } from './count.controller';

@Module({
  providers: [PrismaService, CoachService],
  controllers: [CountController],
})
export class PersistenceModule {}
